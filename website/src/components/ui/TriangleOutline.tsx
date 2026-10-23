import { cn } from '../../lib/cn'

interface TriangleOutlineProps {
  className?: string
  /** Stroke color; defaults to Overtop red. */
  color?: string
  strokeWidth?: number
  opacity?: number
}

/**
 * The brand's only graphic device: a cropped 60° triangle outline taken from the logo.
 * Always decorative and positioned by the caller.
 */
export function TriangleOutline({
  className,
  color = 'var(--color-brand)',
  strokeWidth = 30,
  opacity = 1,
}: TriangleOutlineProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 700 610"
      className={cn('pointer-events-none absolute h-auto', className)}
      fill="none"
    >
      <path d="M350 18 L682 592 L18 592 Z" stroke={color} strokeOpacity={opacity} strokeWidth={strokeWidth} />
    </svg>
  )
}
