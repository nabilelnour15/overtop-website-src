/**
 * Photography slots. A slot set to `null` renders a branded graphic instead.
 *
 * To change a photo: put the file in `public/images/` and point `src` at it.
 * `position` is the focus point kept in frame when the slot crops the photo
 * (CSS object-position, e.g. '70% 50%' keeps the right side). Prompts for each
 * image are in `../IMAGE-PROMPTS.md` (project root, next to the logo files).
 */
export type ImageSlotId = 'hero' | 'import' | 'export' | 'transport' | 'customs' | 'about'

export interface SlotImage {
  src: string
  position?: string
}

export const images: Record<ImageSlotId, SlotImage | null> = {
  hero: { src: `${import.meta.env.BASE_URL}images/hero.webp`, position: '50% 62%' },
  import: { src: `${import.meta.env.BASE_URL}images/import.webp`, position: '62% 40%' },
  export: { src: `${import.meta.env.BASE_URL}images/export.webp`, position: '34% 55%' },
  transport: { src: `${import.meta.env.BASE_URL}images/transport.webp`, position: '50% 62%' },
  customs: { src: `${import.meta.env.BASE_URL}images/customs.webp`, position: '22% 55%' },
  about: { src: `${import.meta.env.BASE_URL}images/about.webp`, position: '80% 45%' },
}
