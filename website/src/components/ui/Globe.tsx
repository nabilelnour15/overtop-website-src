import { useEffect, useRef } from 'react'
import { LAND_COLS, LAND_DEG, LAND_MASK, LAND_ROWS } from '../../content/globe-land'
import { cn } from '../../lib/cn'

/**
 * A dotted globe with great-circle lanes between ports, drawn on a 2D canvas
 * with an orthographic projection. Land comes from a small bitmask (see
 * content/globe-land.ts), so there are no image assets and no dependencies.
 *
 * It turns slowly by itself, turns under a finger or mouse, and stops turning
 * (but can still be dragged) when the visitor prefers reduced motion. It only
 * animates while on screen. Nothing touches `window` until the effect runs, so
 * the component prerenders as an empty, labelled canvas.
 */

export interface GlobePoint {
  id: string
  name: string
  lon: number
  lat: number
  /** An Egyptian port: drawn larger, in the brand colour. */
  egypt?: boolean
}

export interface GlobeLane {
  kind: 'sea' | 'air'
  from: readonly [number, number]
  to: readonly [number, number]
}

interface GlobeProps {
  points: GlobePoint[]
  lanes: GlobeLane[]
  /** Screen-reader description of the whole globe. */
  label: string
  /** Arabic labels need the Arabic face on the canvas. */
  rtl?: boolean
  className?: string
}

type Vec = readonly [number, number, number]

const RAD = Math.PI / 180
const RADIUS = 0.47 // of the canvas width
const START = { lon: 31, lat: 22 }
const AUTO_SPEED = 5 // degrees per second
const ARC_STEPS = 48

const COLOR = {
  sea: '#0e0e10',
  seaEdge: '#2a2a2e',
  land: [ '#4a4944', '#8a877f', '#d8d5cc' ],
  brand: '#dc0023',
  flare: '#ff4d5e',
  bone: '#f4f3ef',
  fog: '#a19e96',
}

const toVec = (lon: number, lat: number): Vec => [
  Math.cos(lat * RAD) * Math.sin(lon * RAD),
  Math.sin(lat * RAD),
  Math.cos(lat * RAD) * Math.cos(lon * RAD),
]

/** The land cells' unit vectors, decoded once. */
function decodeLand(): Float32Array {
  const raw = atob(LAND_MASK)
  const out: number[] = []
  for (let i = 0; i < LAND_COLS * LAND_ROWS; i++) {
    if (!(raw.charCodeAt(i >> 3) & (1 << (i & 7)))) continue
    const row = Math.floor(i / LAND_COLS)
    const col = i % LAND_COLS
    out.push(...toVec(-180 + (col + 0.5) * LAND_DEG, 90 - (row + 0.5) * LAND_DEG))
  }
  return Float32Array.from(out)
}

/** Points along the great circle, lifted off the surface so the lane reads as an arc. */
function arc(from: readonly [number, number], to: readonly [number, number]): Vec[] {
  const a = toVec(...from)
  const b = toVec(...to)
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const angle = Math.acos(dot)
  const sin = Math.sin(angle) || 1
  const lift = 0.04 + 0.2 * (angle / Math.PI)
  return Array.from({ length: ARC_STEPS + 1 }, (_, i) => {
    const t = i / ARC_STEPS
    const wa = Math.sin((1 - t) * angle) / sin
    const wb = Math.sin(t * angle) / sin
    const r = 1 + lift * Math.sin(Math.PI * t)
    return [
      (a[0] * wa + b[0] * wb) * r,
      (a[1] * wa + b[1] * wb) * r,
      (a[2] * wa + b[2] * wb) * r,
    ] as const
  })
}

export function Globe({ points, lanes, label, rtl = false, className }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // The latest props, read by the draw loop without restarting it.
  const dataRef = useRef({ points, lanes, rtl })
  useEffect(() => {
    dataRef.current = { points, lanes, rtl }
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const land = decodeLand()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const view = { lon: START.lon, lat: START.lat }
    const drag = { active: false, x: 0, y: 0, vLon: 0, idleUntil: 0 }
    let size = 0
    let dpr = 1
    let frame = 0
    let last = 0
    let onScreen = true
    let arcs: Array<{ kind: GlobeLane['kind']; pts: Vec[] }> = []
    let arcsFor: GlobeLane[] | null = null

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      size = canvas.clientWidth
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
      draw(performance.now())
    }

    /** Rotate a world vector into the view: x right, y up, z towards the viewer. */
    const rotate = (v: Vec): Vec => {
      const cl = Math.cos(view.lon * RAD)
      const sl = Math.sin(view.lon * RAD)
      const cp = Math.cos(view.lat * RAD)
      const sp = Math.sin(view.lat * RAD)
      const x = v[0] * cl - v[2] * sl
      const z0 = v[2] * cl + v[0] * sl
      return [x, cp * v[1] - sp * z0, sp * v[1] + cp * z0]
    }

    const draw = (now: number) => {
      if (!size) return
      const { points: pts, lanes: lns, rtl: isRtl } = dataRef.current
      if (arcsFor !== lns) {
        arcs = lns.map((lane) => ({ kind: lane.kind, pts: arc(lane.from, lane.to) }))
        arcsFor = lns
      }

      const r = size * RADIUS
      const cx = size / 2
      const cy = size / 2
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, size, size)

      // The sea, lit from the upper left.
      const sea = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r)
      sea.addColorStop(0, '#26262b')
      sea.addColorStop(1, COLOR.sea)
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = sea
      ctx.fill()
      ctx.lineWidth = 1
      ctx.strokeStyle = COLOR.seaEdge
      ctx.stroke()

      // Land, as dots that fade towards the limb.
      const dot = Math.max(1.4, r * 0.0115)
      for (let i = 0; i < land.length; i += 3) {
        const [x, y, z] = rotate([land[i], land[i + 1], land[i + 2]])
        if (z <= 0.02) continue
        ctx.fillStyle = COLOR.land[z > 0.6 ? 2 : z > 0.25 ? 1 : 0]
        ctx.fillRect(cx + x * r - dot / 2, cy - y * r - dot / 2, dot, dot)
      }

      // Lanes.
      const visible = (p: Vec) => p[2] > 0 || p[0] * p[0] + p[1] * p[1] > 1
      const t = now / 1000
      for (const [index, lane] of arcs.entries()) {
        const air = lane.kind === 'air'
        ctx.beginPath()
        ctx.strokeStyle = air ? 'rgba(244,243,239,0.55)' : 'rgba(255,77,94,0.75)'
        ctx.lineWidth = air ? 1 : 1.25
        ctx.setLineDash(air ? [3, 4] : [])
        let pen = false
        const screen: Array<[number, number] | null> = lane.pts.map((p) => {
          const v = rotate(p)
          return visible(v) ? [cx + v[0] * r, cy - v[1] * r] : null
        })
        for (const point of screen) {
          if (!point) {
            pen = false
            continue
          }
          if (pen) ctx.lineTo(point[0], point[1])
          else ctx.moveTo(point[0], point[1])
          pen = true
        }
        ctx.stroke()
        ctx.setLineDash([])

        // One pulse per lane, running out and back.
        if (!reduced.matches) {
          const phase = ((t * 0.11 + index * 0.137) % 1)
          const at = screen[Math.floor(phase * ARC_STEPS)]
          if (at) {
            ctx.fillStyle = air ? COLOR.bone : COLOR.flare
            ctx.fillRect(at[0] - 1.5, at[1] - 1.5, 3, 3)
          }
        }
      }

      // Ports and their names.
      ctx.font = `600 ${Math.max(10, r * 0.026)}px ${isRtl ? '"Alexandria", "Archivo"' : '"IBM Plex Mono"'}, monospace`
      ctx.textBaseline = 'middle'
      for (const port of pts) {
        const [x, y, z] = rotate(toVec(port.lon, port.lat))
        if (z <= 0.02) continue
        const px = cx + x * r
        const py = cy - y * r
        const s = port.egypt ? 6 : 4
        if (port.egypt) {
          ctx.fillStyle = 'rgba(220,0,35,0.25)'
          ctx.fillRect(px - s, py - s, s * 2, s * 2)
        }
        ctx.fillStyle = port.egypt ? COLOR.brand : COLOR.bone
        ctx.fillRect(px - s / 2, py - s / 2, s, s)
        if (!port.egypt && z > 0.3) {
          ctx.fillStyle = z > 0.55 ? COLOR.bone : COLOR.fog
          ctx.textAlign = isRtl ? 'right' : 'left'
          ctx.fillText(port.name, px + (isRtl ? -7 : 7), py)
        }
      }
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!drag.active) {
        if (Math.abs(drag.vLon) > 0.01) {
          view.lon += drag.vLon * dt
          drag.vLon *= Math.pow(0.04, dt)
        } else if (!reduced.matches && now > drag.idleUntil) {
          view.lon += AUTO_SPEED * dt
        }
      }
      draw(now)
    }

    const start = () => {
      if (frame || !onScreen) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    // Dragging: one pixel of travel is 1/r radians of turn at the centre.
    const onDown = (event: PointerEvent) => {
      drag.active = true
      drag.x = event.clientX
      drag.y = event.clientY
      drag.vLon = 0
      canvas.setPointerCapture(event.pointerId)
    }
    const onMove = (event: PointerEvent) => {
      if (!drag.active) return
      const k = 1 / (size * RADIUS * RAD)
      const dx = event.clientX - drag.x
      const dy = event.clientY - drag.y
      drag.x = event.clientX
      drag.y = event.clientY
      view.lon -= dx * k
      view.lat = Math.max(-60, Math.min(60, view.lat + dy * k))
      drag.vLon = (-dx * k) / 0.016
      if (!frame) draw(performance.now())
    }
    const onUp = (event: PointerEvent) => {
      if (!drag.active) return
      drag.active = false
      drag.idleUntil = performance.now() + 2500
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      if (reduced.matches) drag.vLon = 0
    }

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      if (onScreen) start()
      else stop()
    })
    const resizer = new ResizeObserver(resize)
    observer.observe(canvas)
    resizer.observe(canvas)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    // Labels use web fonts that may arrive after the first frame.
    void document.fonts?.ready.then(() => draw(performance.now()))
    resize()
    start()

    return () => {
      stop()
      observer.disconnect()
      resizer.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={cn('block aspect-square w-full cursor-grab touch-pan-y active:cursor-grabbing', className)}
    />
  )
}
