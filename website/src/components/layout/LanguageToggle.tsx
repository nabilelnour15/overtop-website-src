import { useI18n } from '../../i18n/context'
import { cn } from '../../lib/cn'

/** Switches EN ⇄ AR. Labelled in the target language so each audience can find it. */
export function LanguageToggle({ className }: { className?: string }) {
  const { t, setLocale } = useI18n()
  const { target, short, label } = t.languageSwitch

  return (
    <button
      type="button"
      onClick={() => setLocale(target)}
      lang={target}
      aria-label={label}
      className={cn(
        'flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-5 font-semibold text-slate',
        'transition-colors duration-150 hover:bg-concrete hover:text-ink',
        target === 'ar' ? 'font-[family-name:var(--font-arabic)]' : 'code text-sm',
        className,
      )}
    >
      {short}
    </button>
  )
}
