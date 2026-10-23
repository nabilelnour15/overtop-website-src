import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/** The 1240px content column with a 16px phone gutter. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-[1240px] px-4 sm:px-6', className)}>{children}</div>
}
