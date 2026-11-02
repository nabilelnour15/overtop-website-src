import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
import { useI18n } from '../../i18n/context'
import { cn } from '../../lib/cn'

/**
 * Four stops along a rule, each marked with a ▲ — read on ink. The rule fills
 * from the first stop to the last as the list scrolls through the screen
 * (left to right on wide screens, top to bottom where the stops stack).
 */
export function RouteSteps() {
  const { t } = useI18n()
  const { heading, steps } = t.route
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = list.getBoundingClientRect()
      const view = window.innerHeight
      const progress = (view * 0.85 - rect.top) / (rect.height + view * 0.35)
      list.style.setProperty('--p', String(Math.min(1, Math.max(0, progress))))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div>
      <h3 className="label mb-10 text-fog">{heading}</h3>
      {/* --p is the scroll progress, 0 to 1; without JS (or with reduced motion) the rule is full. */}
      <ol ref={listRef} style={{ '--p': 1 } as CSSProperties} className="grid gap-x-0 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const last = index === steps.length - 1
          // How far the rule has reached into this step, 0 to 1.
          const reach = `clamp(0, calc(var(--p) * ${steps.length} - ${index}), 1)`
          return (
            <li key={step.title} className="relative flex flex-col gap-3 border-t-2 border-deck pe-6">
              <span
                aria-hidden="true"
                style={{ transform: `scaleX(${reach})` }}
                className={cn(
                  'absolute -top-0.5 inset-x-0 h-0.5 origin-left rtl:origin-right',
                  last ? 'bg-bone' : 'bg-brand',
                )}
              />
              <span
                aria-hidden="true"
                style={{ opacity: `calc(0.3 + 0.7 * ${reach})` }}
                className={cn(
                  '-mt-[9px] size-0 border-x-[9px] border-b-[15px] border-x-transparent',
                  last ? 'border-b-bone' : 'border-b-brand',
                )}
              />
              <span className="label text-fog">
                <span className="code">{String(index + 1).padStart(2, '0')}</span>
              </span>
              <span className="display-m">{step.title}</span>
              <span className="text-[15px] leading-relaxed text-fog text-pretty">{step.body}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
