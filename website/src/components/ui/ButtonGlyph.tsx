import { PlayGlyph } from './icons'

/** The system's signature: a hairline divider, then the ▶ cell. */
export function ButtonGlyph() {
  return (
    <span className="flex items-center gap-4">
      <span aria-hidden="true" className="h-6 w-px bg-current opacity-40" />
      <PlayGlyph />
    </span>
  )
}
