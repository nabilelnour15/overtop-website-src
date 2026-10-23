import { cn } from '../../lib/cn'
import { useI18n } from '../../i18n/context'

interface SectionMarkerProps {
  number: string
  label: string
  /** The same label in the other language, shown at the far end of the rule. */
  altLabel: string
  tone?: 'light' | 'dark'
  className?: string
}

/** "02 — SERVICES ··· الخدمات": the ruled header that opens every section. */
export function SectionMarker({ number, label, altLabel, tone = 'light', className }: SectionMarkerProps) {
  const { altLocale } = useI18n()
  return (
    <div
      className={cn(
        'label grid grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline gap-x-3 border-t-2 pt-3 sm:grid-cols-[4rem_minmax(0,1fr)_auto]',
        tone === 'dark' ? 'border-bone' : 'border-ink',
        className,
      )}
    >
      <span className="code">{number}</span>
      <span>{label}</span>
      <span lang={altLocale} dir={altLocale === 'ar' ? 'rtl' : 'ltr'} className="label opacity-80">
        {altLabel}
      </span>
    </div>
  )
}
