import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * Halftone Routes — a shipping chart printed in dots.
 *
 * Adapted from the 21st.dev "Halftone Nebula". The printing is the same: the
 * picture is sampled once per pixel cell, quantised with an ordered Bayer
 * dither, and every cell gets a flat square with a round dot on top whose
 * radius follows density. What changed is the picture — a map instead of gas.
 *
 * Land is rasterised once from lon/lat polygons into a small mask texture.
 * Lanes are polylines measured in CSS px, so pulses can run along them: one
 * leaving the origin and one coming home on every lane — export and import.
 * Ports reuse the nebula's sparkle stars; the pointer is a loupe that swells
 * the dots under it, and a click (or the origin, every few seconds) sends a
 * ping ring across the chart.
 *
 * Two passes keep it cheap: the chart is worked out once per *cell* into a
 * small framebuffer, then printed per pixel. Raw WebGL2, no image assets. The
 * canvas sizes itself from its own box and releases every GL object on unmount.
 */

export type LonLat = readonly [number, number]

export interface MapView {
  /** Centre of the chart. */
  lon: number
  lat: number
  /** The chart always shows at least this many degrees across and down. */
  spanLon: number
  spanLat: number
}

export interface RouteLane {
  kind: 'sea' | 'road'
  points: readonly LonLat[]
}

export interface RoutePort {
  id: string
  code: string
  name: string
  lon: number
  lat: number
  /** The port every lane starts from — drawn larger, and pings on its own. */
  origin?: boolean
  /** Where the label sits. Physical, since a map never mirrors. */
  side?: 'left' | 'right' | 'above' | 'below'
}

export interface RouteParams {
  // the grid
  /** CSS px per pixel cell. Everything snaps to this. */
  pixel: number
  /** Dot radius, in cells, where the chart is empty / densest. */
  dotMin: number
  dotMax: number
  /** Quantisation steps before dithering. */
  levels: number
  // the chart
  swell: number
  drift: number
  relief: number
  coast: number
  /** Graticule spacing in degrees; 0 hides it. */
  graticule: number
  // lanes
  /** Lane thickness, in cells. */
  laneWidth: number
  /** CSS px per second. */
  pulseSpeed: number
  /** Trail behind each pulse, CSS px. */
  pulseTrail: number
  // ports
  twinkle: number
  spikeWidth: number
  // the pointer
  lens: number
  lensRadius: number
  lensPush: number
  rippleSpeed: number
  /** Seconds between pings from the origin. 0 stops them. */
  pingEvery: number
  // post
  speed: number
  vignette: number
  grain: number
  // palette
  seaColor: string
  shelfColor: string
  deepColor: string
  landColor: string
  coastColor: string
  laneColor: string
  pulseColor: string
  roadColor: string
  starColor: string
}

/** Overtop tokens: ink grounds, mineral neutrals, red only on the lanes. */
const ROUTE_DEFAULTS: RouteParams = {
  pixel: 6,
  dotMin: 0.1,
  dotMax: 0.56,
  levels: 6,

  swell: 0.7,
  drift: 0.05,
  relief: 0.55,
  coast: 0.75,
  graticule: 10,

  laneWidth: 1.2,
  pulseSpeed: 70,
  pulseTrail: 110,

  twinkle: 1.2,
  spikeWidth: 1,

  lens: 0.55,
  lensRadius: 150,
  lensPush: 0.14,
  rippleSpeed: 340,
  pingEvery: 4.5,

  speed: 1,
  vignette: 0.45,
  grain: 0.03,

  seaColor: '#111113', // ink
  shelfColor: '#1b1b1e', // hull
  deepColor: '#2a2a2e', // deck
  landColor: '#5c5a55', // slate
  coastColor: '#a19e96', // fog
  laneColor: '#dc0023', // brand
  pulseColor: '#ff4d5e', // flare
  roadColor: '#f4f3ef', // bone
  starColor: '#f4f3ef', // bone
}

const MAX_SEGS = 160
const MAX_SPARKS = 24
const MAX_RIPPLES = 4

/** The land mask covers this box (west lon, north lat, spans) at LAND_PPD px per degree. */
const LAND_BOX = [-60, 80, 180, 130] as const
const LAND_PPD = 4

type Kind = 'f' | 'c'
type Slot = readonly [keyof RouteParams, Kind]

/** Which parameters reach each shader, and as what. `c` is a hex colour. */
const FIELD_UNIFORMS: Slot[] = [
  ['pixel', 'f'], ['levels', 'f'], ['swell', 'f'], ['drift', 'f'], ['relief', 'f'], ['coast', 'f'],
  ['graticule', 'f'], ['laneWidth', 'f'], ['pulseSpeed', 'f'], ['pulseTrail', 'f'],
  ['lens', 'f'], ['lensRadius', 'f'], ['lensPush', 'f'], ['rippleSpeed', 'f'],
  ['deepColor', 'c'], ['landColor', 'c'], ['coastColor', 'c'], ['laneColor', 'c'],
  ['pulseColor', 'c'], ['roadColor', 'c'], ['starColor', 'c'],
]
const PRINT_UNIFORMS: Slot[] = [
  ['pixel', 'f'], ['dotMin', 'f'], ['dotMax', 'f'], ['twinkle', 'f'], ['spikeWidth', 'f'],
  ['vignette', 'f'], ['grain', 'f'],
  ['seaColor', 'c'], ['shelfColor', 'c'], ['laneColor', 'c'], ['starColor', 'c'],
]

const uName = (k: string) => 'u' + k[0].toUpperCase() + k.slice(1)
const declare = (slots: Slot[]) =>
  slots.map(([k, kind]) => 'uniform ' + (kind === 'c' ? 'vec3' : 'float') + ' ' + uName(k) + ';').join('\n')

const VERT = `#version 300 es
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const NOISE = `
float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash12(i), b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0)), d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float s = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = r * p * 2.03 + 17.1; a *= 0.5; }
  return s / 0.9375;
}
float bayer4(vec2 c){
  vec2 m = mod(c, 4.0);
  int i = int(m.x) + int(m.y) * 4;
  int b[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(b[i]) + 0.5) / 16.0;
}`

/**
 * Pass 1, one fragment per cell. Writes the dot colour to rgb and packs
 * land (0 / 0.5) + quantised density (0..0.49) into alpha.
 */
const FIELD = `#version 300 es
precision highp float;
uniform vec2 uCss;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerOn;
uniform vec4 uView;     // lon, lat, degrees per CSS px, cos(lat)
uniform vec4 uLandBox;  // west lon, north lat, lon span, lat span
uniform sampler2D uLand;
uniform highp sampler2D uSegs;
uniform int uSegCount;
uniform vec4 uRipple[${MAX_RIPPLES}];
${declare(FIELD_UNIFORMS)}
out vec4 frag;
${NOISE}

vec2 lonLat(vec2 pos){
  vec2 d = (pos - 0.5 * uCss) * uView.z;
  return vec2(uView.x + d.x / uView.w, uView.y + d.y);
}
float landAt(vec2 ll){
  vec2 uv = vec2(ll.x - uLandBox.x, uLandBox.y - ll.y) / uLandBox.zw;
  float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  return textureLod(uLand, clamp(uv, 0.0, 1.0), 0.0).r * inside;
}
float trailAt(float x){
  return x < 0.0 || x > uPulseTrail ? 0.0 : pow(1.0 - x / uPulseTrail, 1.5);
}

void main(){
  vec2 cell = floor(gl_FragCoord.xy);
  float px = max(uPixel, 1.0);
  vec2 cellC = (cell + 0.5) * px;
  float L = max(uLevels, 2.0);
  float dith = bayer4(cell);
  float t = uTime;

  // The pointer is a loupe: it magnifies the chart a touch and swells the dots.
  vec2 toP = cellC - uPointer;
  float lamp = exp(-dot(toP, toP) / (uLensRadius * uLensRadius)) * uPointerOn;
  vec2 pos = cellC - toP * lamp * uLensPush;

  // ---- the chart --------------------------------------------------------------
  vec2 ll = lonLat(pos);
  float m = landAt(ll);
  float land = step(0.5, m);
  float coast = smoothstep(0.2, 0.9, 1.0 - abs(m - 0.5) * 2.0);
  float relief = fbm(ll * 0.32 + 7.3);
  float swell = fbm(ll * 0.55 + vec2(t * uDrift, -t * uDrift * 0.6));

  float grid = 0.0;
  if (uGraticule > 0.0) {
    vec2 cellDeg = vec2(px * uView.z / uView.w, px * uView.z);
    vec2 g = abs(fract(ll / uGraticule + 0.5) - 0.5) * uGraticule;
    grid = max(step(g.x, cellDeg.x * 0.5), step(g.y, cellDeg.y * 0.5)) * mod(cell.x + cell.y, 2.0);
  }

  float d = mix(0.04 + swell * uSwell * 0.3 + grid * 0.25, 0.26 + relief * uRelief * 0.4 + coast * uCoast * 0.34, land);
  vec3 col = mix(mix(uDeepColor, uLandColor, grid * 0.5), mix(uLandColor, uCoastColor, coast * uCoast), land);

  // ---- pings --------------------------------------------------------------------
  float ring = 0.0;
  for (int i = 0; i < ${MAX_RIPPLES}; i++) {
    vec4 r = uRipple[i];
    float age = t - r.z;
    if (r.w <= 0.0 || age < 0.0 || age > 2.4) continue;
    float dist = length(cellC - r.xy);
    float w = 5.0 + age * 6.0;
    ring += exp(-pow((dist - age * uRippleSpeed) / w, 2.0)) * pow(1.0 - age / 2.4, 2.0) * r.w;
  }

  // ---- lanes: row 0 = (x0, y0, x1, y1), row 1 = (start, length, lane total, id*2 + road) ----
  float lane = 0.0, road = 0.0, glow = 0.0, head = 0.0;
  float w = max(uLaneWidth * px * 0.5, 0.75);
  for (int i = 0; i < ${MAX_SEGS}; i++) {
    if (i >= uSegCount) break;
    vec4 a = texelFetch(uSegs, ivec2(i, 0), 0);
    vec2 e = a.zw - a.xy;
    float h = clamp(dot(pos - a.xy, e) / max(dot(e, e), 1e-3), 0.0, 1.0);
    float dist = length(pos - a.xy - e * h);
    if (dist > w + px * 1.5) continue;
    vec4 b = texelFetch(uSegs, ivec2(i, 1), 0);
    float along = b.x + h * b.y;
    float isRoad = mod(b.w, 2.0);
    float run = t * uPulseSpeed / b.z + hash12(vec2(floor(b.w * 0.5), 4.1));
    float dOut = fract(run) * b.z - along;                // leaving the origin
    float dIn = along - (1.0 - fract(run + 0.5)) * b.z;   // coming home
    float on = step(dist, w);
    lane = max(lane, on * (1.0 - isRoad));
    road = max(road, on * isRoad * step(0.5, fract(along / (px * 3.0))));
    glow = max(glow, step(dist, w + px * 0.5) * max(trailAt(dOut), trailAt(dIn)));
    head = max(head, on * step(min(abs(dOut), abs(dIn)), px * 0.5));
  }

  d = clamp(d + lamp * uLens * 0.4 + ring * 0.5, 0.0, 1.0);
  col = mix(col, uCoastColor, lamp * uLens * 0.5);
  col = mix(col, uLaneColor, step(dith * 0.4 + 0.45, ring));
  if (lane > 0.5) { d = max(d, 0.6); col = uLaneColor; }
  if (road > 0.5) { d = max(d, 0.5); col = uRoadColor; }
  float gq = floor(glow * L + dith) / L;
  if (gq > 0.0) { d = max(d, 0.6 + gq * 0.4); col = mix(uLaneColor, uPulseColor, gq); }
  if (head > 0.5) { d = 1.0; col = uStarColor; }

  float dq = clamp(floor(d * L + dith) / L, 0.0, 1.0);
  frag = vec4(col, land * 0.5 + dq * 0.49);
}`

/** Pass 2, per pixel: print each cell as a halftone dot, then the port stars on top. */
const PRINT = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform sampler2D uCells;
uniform int uSparkCount;
uniform vec4 uSpark[${MAX_SPARKS}];
uniform vec4 uSparkB[${MAX_SPARKS}];
${declare(PRINT_UNIFORMS)}
out vec4 frag;

float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main(){
  vec2 css = gl_FragCoord.xy / uDpr;
  float px = max(uPixel, 1.0);
  vec2 cell = floor(css / px);
  vec2 f = fract(css / px) - 0.5;

  vec4 c = texelFetch(uCells, ivec2(cell), 0);
  float land = step(0.5, c.a);
  float dq = clamp((c.a - land * 0.5) / 0.49, 0.0, 1.0);
  vec3 bg = mix(uSeaColor, uShelfColor, land);
  float r = mix(uDotMin, uDotMax, sqrt(dq));
  vec3 col = mix(bg, c.rgb, step(length(f), r));

  // ---- ports: chunky core, needle spikes -------------------------------------
  for (int i = 0; i < ${MAX_SPARKS}; i++) {
    if (i >= uSparkCount) break;
    vec4 s = uSpark[i];
    vec4 b = uSparkB[i];
    float age = uTime - s.w;
    if (age < 0.0) continue;
    float grow = smoothstep(0.0, 0.55, age);
    float tw = 0.84 + 0.16 * sin(uTime * uTwinkle * 1.7 + b.y);
    float flare = 1.0 + b.z * 0.6;
    float reach = s.z * grow * tw * flare;
    float core = b.w * grow * flare;
    vec3 tint = mix(uLaneColor, uStarColor, b.x);
    vec2 d = css - s.xy;
    float th = uSpikeWidth * 0.5 + 0.25;
    float hx = step(abs(d.y), th) * pow(max(1.0 - abs(d.x) / max(reach, 1.0), 0.0), 1.1);
    float vy = step(abs(d.x), th) * pow(max(1.0 - abs(d.y) / max(reach, 1.0), 0.0), 1.1);
    col = mix(col, tint, clamp(max(hx, vy), 0.0, 1.0));
    // The core snaps to a half-cell grid, so it reads as a pixel-art disc.
    float hp = px * 0.5;
    vec2 dcell = (floor(css / hp) + 0.5) * hp - (floor(s.xy / hp) + 0.5) * hp;
    float disc = step(length(dcell), core);
    float glow = exp(-length(d) / max(core * 1.4, 1.0)) * (1.0 - disc);
    col += tint * glow * 0.35;
    col = mix(col, tint, disc);
    float cross = max(step(abs(d.y), th) * step(abs(d.x), core * 0.85),
                      step(abs(d.x), th) * step(abs(d.y), core * 0.85));
    col = mix(col, uStarColor, cross * disc * 0.9);
  }

  // ---- post -----------------------------------------------------------------
  vec2 vu = gl_FragCoord.xy / uRes - 0.5;
  col *= 1.0 - uVignette * smoothstep(0.35, 0.95, length(vu * vec2(uRes.x / uRes.y, 1.0) * 1.1));
  col += (hash12(floor(css) + fract(uTime) * 91.0) - 0.5) * uGrain;
  frag = vec4(max(col, vec3(0.0)), 1.0);
}`

/** Degrees per CSS px, chosen so the whole span fits, and the x squeeze for the centre latitude. */
function fitView(view: MapView, w: number, h: number) {
  const k = Math.cos((view.lat * Math.PI) / 180)
  const degPerPx = Math.max((view.spanLon * k) / Math.max(w, 1), view.spanLat / Math.max(h, 1))
  return { k, degPerPx }
}

/** lon/lat → CSS px from the box's bottom-left corner (y up, like gl_FragCoord). */
function project(view: MapView, w: number, h: number, lon: number, lat: number): [number, number] {
  const { k, degPerPx } = fitView(view, w, h)
  return [w / 2 + ((lon - view.lon) * k) / degPerPx, h / 2 + (lat - view.lat) / degPerPx]
}

function rasterLand(land: readonly (readonly LonLat[])[], water: readonly (readonly LonLat[])[]) {
  const [west, north, spanLon, spanLat] = LAND_BOX
  const canvas = document.createElement('canvas')
  canvas.width = spanLon * LAND_PPD
  canvas.height = spanLat * LAND_PPD
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // Soft coastlines give the coast its own ring of brighter dots. Where canvas
  // filters are unsupported this is ignored and linear sampling does the rest.
  ctx.filter = 'blur(1.5px)'
  const fill = (poly: readonly LonLat[]) => {
    ctx.beginPath()
    poly.forEach(([lon, lat], i) => {
      const x = (lon - west) * LAND_PPD
      const y = (north - lat) * LAND_PPD
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.fill()
  }
  ctx.fillStyle = '#fff'
  land.forEach(fill)
  ctx.fillStyle = '#000'
  water.forEach(fill)
  return canvas
}

/** "#f0a" / "#ff00aa" → [r, g, b] in 0..1. Anything unparsable is black. */
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return [0, 0, 0]
  const v = parseInt(h, 16)
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]
}

/** The idle loupe: wanders the chart on incommensurate sines, never closing a loop. */
function driftPos(t: number) {
  const x = 0.5 + 0.32 * Math.sin(t * 0.21) + 0.1 * Math.sin(t * 0.077 + 1.3)
  const y = 0.5 + 0.26 * Math.cos(t * 0.17) + 0.12 * Math.cos(t * 0.053 + 4.2)
  return [Math.min(Math.max(x, 0.05), 0.95), Math.min(Math.max(y, 0.05), 0.95)]
}

const LABEL_SIDE: Record<NonNullable<RoutePort['side']>, string> = {
  right: 'translate-x-3 -translate-y-1/2',
  left: '-translate-x-[calc(100%+0.75rem)] -translate-y-1/2',
  above: '-translate-x-1/2 -translate-y-[calc(100%+0.75rem)]',
  below: '-translate-x-1/2 translate-y-3',
}

export interface HalftoneRoutesProps {
  /** Land polygons in lon/lat. Keep the arrays stable — they are rasterised once. */
  land: readonly (readonly LonLat[])[]
  /** Inland seas and lakes, cut back out of the land. */
  water?: readonly (readonly LonLat[])[]
  lanes: readonly RouteLane[]
  ports: readonly RoutePort[]
  view: MapView
  /**
   * Explicit height. The canvas fills this box, so it must be a definite
   * length — "100%" only works if every ancestor has one too.
   */
  height?: string
  params?: Partial<RouteParams>
  /** Pointer works the loupe; click sends a ping. */
  interactive?: boolean
  /** Device-pixel-ratio cap. The print pass is per pixel; the dots are 6px anyway. */
  maxDpr?: number
  /** Port code + name next to each marker. Only the origin's shows below md. */
  showLabels?: boolean
  /** Describes the chart for screen readers. */
  label: string
  /** Content laid over the chart. Pointer events pass through unless opted in. */
  children?: ReactNode
  className?: string
}

const NO_WATER: readonly (readonly LonLat[])[] = []

export default function HalftoneRoutes({
  land,
  water = NO_WATER,
  lanes,
  ports,
  view,
  height = 'clamp(460px, 56vw, 780px)',
  params,
  interactive = true,
  maxDpr = 1.5,
  showLabels = true,
  label,
  children,
  className,
}: HalftoneRoutesProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  const [generation, setGeneration] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [box, setBox] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const P = useMemo<RouteParams>(() => ({ ...ROUTE_DEFAULTS, ...params }), [params])

  // The loop reads through refs, so new copy or tuning never restarts WebGL.
  const live = useRef({ P, lanes, ports, view })
  useEffect(() => {
    live.current = { P, lanes, ports, view }
  }, [P, lanes, ports, view])

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      powerPreference: 'high-performance',
    })
    if (!gl) {
      setFailed(true)
      return
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('halftone-routes:', gl.getShaderInfoLog(s))
        gl.deleteShader(s)
        return null
      }
      return s
    }
    const link = (frag: string) => {
      const vs = compile(gl.VERTEX_SHADER, VERT)
      const fs = compile(gl.FRAGMENT_SHADER, frag)
      const program = vs && fs ? gl.createProgram() : null
      if (!program || !vs || !fs) {
        if (vs) gl.deleteShader(vs)
        if (fs) gl.deleteShader(fs)
        return null
      }
      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      // Attached shaders are only flagged here; the program keeps them alive.
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('halftone-routes:', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
      }
      return program
    }
    const fieldProg = link(FIELD)
    const printProg = link(PRINT)
    if (!fieldProg || !printProg) {
      if (fieldProg) gl.deleteProgram(fieldProg)
      if (printProg) gl.deleteProgram(printProg)
      setFailed(true)
      return
    }

    const locs = (program: WebGLProgram, names: string[]) =>
      Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(program, n)]))
    const tunedField = FIELD_UNIFORMS.map(([k, kind]) => [gl.getUniformLocation(fieldProg, uName(k)), k, kind] as const)
    const tunedPrint = PRINT_UNIFORMS.map(([k, kind]) => [gl.getUniformLocation(printProg, uName(k)), k, kind] as const)
    const F = locs(fieldProg, ['uCss', 'uTime', 'uPointer', 'uPointerOn', 'uView', 'uLandBox', 'uLand', 'uSegs', 'uSegCount', 'uRipple'])
    const R = locs(printProg, ['uRes', 'uDpr', 'uTime', 'uCells', 'uSparkCount', 'uSpark', 'uSparkB'])
    const vao = gl.createVertexArray()

    const texture = (filter: number) => {
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      return tex
    }

    // ---- the land mask, rasterised once --------------------------------------
    const landTex = texture(gl.LINEAR)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rasterLand(land, water))

    // ---- lane segments, as a 2-row float texture -----------------------------
    const segTex = texture(gl.NEAREST)
    const segData = new Float32Array(MAX_SEGS * 2 * 4)
    let segCount = 0

    // ---- the per-cell chart, rendered into this --------------------------------
    const cellTex = texture(gl.NEAREST)
    const fbo = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, cellTex, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    let cols = 0
    let rows = 0

    // ---- sizing, from the element rather than the window --------------------
    let lost = false
    let cssW = 1
    let cssH = 1
    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, Math.max(maxDpr, 0.5))
      cssW = Math.max(canvas.clientWidth, 1)
      cssH = Math.max(canvas.clientHeight, 1)
      const w = Math.floor(cssW * dpr)
      const h = Math.floor(cssH * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      setBox((b) => (b.w === cssW && b.h === cssH ? b : { w: cssW, h: cssH }))
      // Resizing clears the drawing buffer; repaint now rather than show a blank frame.
      if (!lost) paint()
    }

    // ---- layout: lanes and ports in CSS px, redone when size or data changes --
    const sparkA = new Float32Array(MAX_SPARKS * 4)
    const sparkB = new Float32Array(MAX_SPARKS * 4)
    const flare = new Float32Array(MAX_SPARKS)
    let sparkCount = 0
    let originX = -1
    let originY = -1
    let laidOut = ''
    let laidData: unknown[] = []

    const layout = () => {
      const { lanes, ports, view } = live.current
      segData.fill(0)
      segCount = 0
      lanes.forEach((lane, id) => {
        const pts = lane.points.map(([lon, lat]) => project(view, cssW, cssH, lon, lat))
        let total = 0
        for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
        let along = 0
        for (let i = 1; i < pts.length && segCount < MAX_SEGS; i++) {
          const [x0, y0] = pts[i - 1]
          const [x1, y1] = pts[i]
          const len = Math.hypot(x1 - x0, y1 - y0)
          segData.set([x0, y0, x1, y1], segCount * 4)
          segData.set([along, len, Math.max(total, 1), id * 2 + (lane.kind === 'road' ? 1 : 0)], (MAX_SEGS + segCount) * 4)
          along += len
          segCount++
        }
      })
      gl.bindTexture(gl.TEXTURE_2D, segTex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, MAX_SEGS, 2, 0, gl.RGBA, gl.FLOAT, segData)

      const minSide = Math.min(cssW, cssH)
      sparkCount = Math.min(ports.length, MAX_SPARKS)
      originX = -1
      for (let i = 0; i < sparkCount; i++) {
        const port = ports[i]
        const [x, y] = project(view, cssW, cssH, port.lon, port.lat)
        if (port.origin) {
          originX = x
          originY = y
        }
        sparkA.set([x, y, port.origin ? 0.09 * minSide : 0.028 * minSide, -10], i * 4)
        sparkB.set([port.origin ? 0 : 1, i * 1.7, 0, port.origin ? Math.max(0.011 * minSide, 4) : 2], i * 4)
      }
    }

    const ripples = new Float32Array(MAX_RIPPLES * 4)
    let rippleNext = 0
    const ping = (x: number, y: number, now: number) => {
      ripples.set([x, y, now, reduced ? 0 : 1], rippleNext * 4)
      rippleNext = (rippleNext + 1) % MAX_RIPPLES
    }

    // Reduced motion freezes the clock on a frame with the pulses already out.
    const FROZEN = 14
    const t0 = performance.now()
    const clock = () => (reduced ? FROZEN : ((performance.now() - t0) / 1000) * live.current.P.speed)
    let lastClock = 0
    let lastPing = -1e9

    // ---- the pointer --------------------------------------------------------
    let targetX = 0.5
    let targetY = 0.5
    let lampX = 0.5
    let lampY = 0.5
    let lampOn = 0
    let inside = false
    let lastTouched = -1e9

    const toUv = (e: PointerEvent): [number, number] => {
      const r = canvas.getBoundingClientRect()
      return [
        Math.min(Math.max((e.clientX - r.left) / Math.max(r.width, 1), 0), 1),
        Math.min(Math.max(1 - (e.clientY - r.top) / Math.max(r.height, 1), 0), 1),
      ]
    }
    const onMove = (e: PointerEvent) => {
      if (!interactive) return
      ;[targetX, targetY] = toUv(e)
      inside = true
      lastTouched = performance.now() / 1000
    }
    const onLeave = () => {
      inside = false
    }
    const onDown = (e: PointerEvent) => {
      if (!interactive || e.button > 0) return
      // Let buttons and links in the overlay keep their clicks.
      if ((e.target as HTMLElement | null)?.closest('a,button,input,textarea,select,label,[role=button]')) return
      const [x, y] = toUv(e)
      targetX = x
      targetY = y
      inside = true
      lastTouched = performance.now() / 1000
      ping(x * cssW, y * cssH, clock())
      if (reduced) paint()
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerdown', onDown)
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('pointercancel', onLeave)

    const onLost = (e: Event) => {
      e.preventDefault()
      lost = true
      cancelAnimationFrame(raf)
      raf = 0
    }
    const onRestored = () => setGeneration((g) => g + 1)
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    const setTuned = (tuned: typeof tunedField, p: RouteParams) => {
      for (const [l, key, kind] of tuned) {
        const v = p[key]
        if (kind === 'c') gl.uniform3fv(l, hexToRgb(v as string))
        else gl.uniform1f(l, v as number)
      }
    }

    // ---- one frame ----------------------------------------------------------
    const paint = () => {
      const { P: p, lanes, ports, view } = live.current
      const key = cssW + 'x' + cssH
      if (key !== laidOut || laidData[0] !== lanes || laidData[1] !== ports || laidData[2] !== view) {
        layout()
        laidOut = key
        laidData = [lanes, ports, view]
      }
      const px = Math.max(p.pixel, 1)
      const c = Math.ceil(cssW / px)
      const r = Math.ceil(cssH / px)
      if (c !== cols || r !== rows) {
        cols = c
        rows = r
        gl.bindTexture(gl.TEXTURE_2D, cellTex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      }

      const t = clock()
      const dt = Math.min(Math.max(t - lastClock, 0), 0.1)
      lastClock = t
      if (!reduced && p.pingEvery > 0 && originX >= 0 && t - lastPing > p.pingEvery) {
        ping(originX, originY, t)
        lastPing = t
      }

      // With no hand on it, the loupe wanders on its own so the chart never sits dead.
      const idle = !inside || performance.now() / 1000 - lastTouched > 6
      const [gx, gy] = driftPos(t * 0.6)
      const wantX = idle ? gx : targetX
      const wantY = idle ? gy : targetY
      const k = reduced ? 1 : 1 - Math.exp(-dt * (idle ? 1.5 : 7))
      lampX += (wantX - lampX) * k
      lampY += (wantY - lampY) * k
      const onTarget = interactive && !reduced ? (idle ? 0.45 : 1) : 0
      lampOn += (onTarget - lampOn) * (reduced ? 1 : 1 - Math.exp(-dt * 3))

      for (let i = 0; i < sparkCount; i++) {
        const reach = sparkA[i * 4 + 2]
        const d = Math.hypot(sparkA[i * 4] - lampX * cssW, sparkA[i * 4 + 1] - lampY * cssH)
        const want = interactive && !reduced ? Math.exp(-(d * d) / Math.max(reach * reach * 0.6, 400)) : 0
        flare[i] += (want - flare[i]) * (reduced ? 1 : 1 - Math.exp(-dt * 6))
        sparkB[i * 4 + 2] = flare[i]
      }

      const { k: squeeze, degPerPx } = fitView(view, cssW, cssH)
      gl.bindVertexArray(vao)

      // Pass 1: the chart, one fragment per cell.
      gl.useProgram(fieldProg)
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.viewport(0, 0, cols, rows)
      setTuned(tunedField, p)
      gl.uniform2f(F.uCss, cssW, cssH)
      gl.uniform1f(F.uTime, t)
      gl.uniform2f(F.uPointer, lampX * cssW, lampY * cssH)
      gl.uniform1f(F.uPointerOn, lampOn)
      gl.uniform4f(F.uView, view.lon, view.lat, degPerPx, squeeze)
      gl.uniform4f(F.uLandBox, LAND_BOX[0], LAND_BOX[1], LAND_BOX[2], LAND_BOX[3])
      gl.uniform1i(F.uSegCount, segCount)
      gl.uniform4fv(F.uRipple, ripples)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, landTex)
      gl.uniform1i(F.uLand, 0)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, segTex)
      gl.uniform1i(F.uSegs, 1)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // Pass 2: print it.
      gl.useProgram(printProg)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, canvas.width, canvas.height)
      setTuned(tunedPrint, p)
      gl.uniform2f(R.uRes, canvas.width, canvas.height)
      gl.uniform1f(R.uDpr, canvas.width / cssW)
      gl.uniform1f(R.uTime, t)
      gl.activeTexture(gl.TEXTURE2)
      gl.bindTexture(gl.TEXTURE_2D, cellTex)
      gl.uniform1i(R.uCells, 2)
      gl.uniform1i(R.uSparkCount, sparkCount)
      gl.uniform4fv(R.uSpark, sparkA)
      gl.uniform4fv(R.uSparkB, sparkB)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    // ---- loop, paused whenever nobody can see it -----------------------------
    let raf = 0
    let visible = true
    const frame = () => {
      raf = 0
      paint()
      if (visible && !document.hidden) raf = requestAnimationFrame(frame)
    }
    const wake = () => {
      if (!reduced && !lost && !raf && visible && !document.hidden) raf = requestAnimationFrame(frame)
    }
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting)
      wake()
    })
    io.observe(root)
    document.addEventListener('visibilitychange', wake)

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    // Paint before the first rAF so nothing ever flashes an empty canvas.
    paint()
    wake()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', wake)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('pointercancel', onLeave)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      gl.deleteFramebuffer(fbo)
      gl.deleteTexture(cellTex)
      gl.deleteTexture(segTex)
      gl.deleteTexture(landTex)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(fieldProg)
      gl.deleteProgram(printProg)
    }
  }, [interactive, reduced, generation, maxDpr, land, water])

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative w-full touch-pan-y overflow-hidden bg-ink',
        interactive && 'cursor-crosshair',
        className,
      )}
      style={{ height }}
    >
      {failed ? (
        // No WebGL2: a still wash in the same palette beats a black box.
        <div
          role="img"
          aria-label={label}
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(40% 50% at 52% 58%, #5c0d1a 0%, transparent 70%),' +
              'radial-gradient(70% 60% at 40% 30%, #2a2a2e 0%, transparent 75%),' +
              '#111113',
          }}
        />
      ) : (
        <canvas ref={canvasRef} role="img" aria-label={label} className="absolute inset-0 block h-full w-full" />
      )}
      {!failed && showLabels && box.w > 0 ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {ports.map((port) => {
            const [x, y] = project(view, box.w, box.h, port.lon, port.lat)
            if (x < 8 || x > box.w - 8 || y < 8 || y > box.h - 8) return null
            return (
              <span
                key={port.id}
                className={cn(
                  'absolute flex items-center gap-1.5 whitespace-nowrap',
                  LABEL_SIDE[port.side ?? 'right'],
                  !port.origin && 'max-md:hidden',
                )}
                style={{ left: x, top: box.h - y }}
              >
                <span
                  className={cn(
                    'code px-1 py-0.5 text-[10px] leading-none',
                    port.origin ? 'bg-brand text-white' : 'bg-ink/80 text-fog',
                  )}
                >
                  {port.code}
                </span>
                <span className={cn('text-[12px] leading-none', port.origin ? 'font-semibold text-bone' : 'text-bone/75')}>
                  {port.name}
                </span>
              </span>
            )
          })}
        </div>
      ) : null}
      {children ? (
        <div className="pointer-events-none relative z-10 flex h-full w-full flex-col">{children}</div>
      ) : null}
    </div>
  )
}
