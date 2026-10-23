import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'ink' | 'outline' | 'outline-light'

const base =
  'action-type inline-flex h-14 items-center justify-center gap-4 px-6 select-none ' +
  'transition-[background-color,color,border-color,transform] duration-150 ease-out active:scale-[0.98] ' +
  'disabled:pointer-events-none disabled:bg-concrete disabled:text-fog'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover active:bg-brand-pressed',
  ink: 'bg-ink text-bone hover:bg-deck',
  outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-bone',
  'outline-light': 'border-2 border-bone text-bone hover:bg-bone hover:text-ink',
}

/**
 * Square, uppercase, 85% width — shared by <a> and <button> so links that look
 * like buttons stay real links. Pair with <ButtonGlyph /> for the split ▶ cell.
 */
export function buttonStyles(variant: ButtonVariant = 'primary', className?: string): string {
  return cn(base, variants[variant], className)
}
