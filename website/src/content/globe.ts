/**
 * The trade-lanes globe: Egypt's ports and the world ports they connect to.
 * Coordinates are [lon, lat]. Names come from the dictionary.
 */

export const egyptPortIds = ['portSaid', 'damietta', 'sokhna', 'safaga', 'cairo'] as const
export type EgyptPortId = (typeof egyptPortIds)[number]

export const worldPortIds = [
  'rotterdam',
  'antwerp',
  'hamburg',
  'genoa',
  'valencia',
  'piraeus',
  'istanbul',
  'newYork',
  'houston',
  'santos',
  'vancouver',
  'lagos',
  'durban',
  'jeddah',
  'jebelAli',
  'mumbai',
  'mombasa',
  'colombo',
  'singapore',
  'hongKong',
  'shanghai',
  'busan',
  'tokyo',
  'sydney',
] as const
export type WorldPortId = (typeof worldPortIds)[number]

export type PortId = EgyptPortId | WorldPortId

export interface GlobePort {
  id: PortId
  lon: number
  lat: number
}

export const EGYPT_PORTS: Array<GlobePort & { id: EgyptPortId }> = [
  { id: 'portSaid', lon: 32.3, lat: 31.26 },
  { id: 'damietta', lon: 31.76, lat: 31.47 },
  { id: 'sokhna', lon: 32.35, lat: 29.6 },
  { id: 'safaga', lon: 33.94, lat: 26.75 },
  { id: 'cairo', lon: 31.41, lat: 30.12 }, // Cairo airport, for the air lanes
]

/** Each world port, and the Egyptian port its sea lane leaves from. */
export const WORLD_PORTS: Array<GlobePort & { id: WorldPortId; hub: EgyptPortId }> = [
  { id: 'piraeus', lon: 23.63, lat: 37.94, hub: 'damietta' },
  { id: 'istanbul', lon: 28.97, lat: 41.01, hub: 'damietta' },
  { id: 'valencia', lon: -0.32, lat: 39.45, hub: 'damietta' },
  { id: 'genoa', lon: 8.92, lat: 44.4, hub: 'portSaid' },
  { id: 'antwerp', lon: 4.4, lat: 51.23, hub: 'portSaid' },
  { id: 'rotterdam', lon: 4.05, lat: 51.95, hub: 'portSaid' },
  { id: 'hamburg', lon: 9.97, lat: 53.54, hub: 'portSaid' },
  { id: 'newYork', lon: -74.0, lat: 40.7, hub: 'damietta' },
  { id: 'houston', lon: -95.27, lat: 29.73, hub: 'damietta' },
  { id: 'santos', lon: -46.3, lat: -23.96, hub: 'damietta' },
  { id: 'vancouver', lon: -123.1, lat: 49.29, hub: 'portSaid' },
  { id: 'lagos', lon: 3.39, lat: 6.45, hub: 'portSaid' },
  { id: 'durban', lon: 31.03, lat: -29.87, hub: 'safaga' },
  { id: 'jeddah', lon: 39.17, lat: 21.48, hub: 'safaga' },
  { id: 'mombasa', lon: 39.67, lat: -4.05, hub: 'safaga' },
  { id: 'jebelAli', lon: 55.03, lat: 25.01, hub: 'sokhna' },
  { id: 'mumbai', lon: 72.95, lat: 18.95, hub: 'sokhna' },
  { id: 'colombo', lon: 79.85, lat: 6.94, hub: 'sokhna' },
  { id: 'singapore', lon: 103.83, lat: 1.26, hub: 'sokhna' },
  { id: 'hongKong', lon: 114.17, lat: 22.3, hub: 'sokhna' },
  { id: 'shanghai', lon: 121.5, lat: 31.23, hub: 'sokhna' },
  { id: 'busan', lon: 129.04, lat: 35.1, hub: 'sokhna' },
  { id: 'tokyo', lon: 139.78, lat: 35.62, hub: 'sokhna' },
  { id: 'sydney', lon: 151.21, lat: -33.86, hub: 'sokhna' },
]

/** Air lanes: Cairo airport to the big air-cargo hubs. */
export const AIR_LANES: WorldPortId[] = [
  'newYork',
  'rotterdam',
  'jebelAli',
  'mumbai',
  'singapore',
  'hongKong',
  'shanghai',
  'mombasa',
  'lagos',
]
