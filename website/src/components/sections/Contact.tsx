import { useId, useRef, useState, type FormEvent } from 'react'
import { serviceIds, site } from '../../config/site'
import { useI18n } from '../../i18n/context'
import { cn } from '../../lib/cn'
import { buttonStyles } from '../ui/button'
import { ButtonGlyph } from '../ui/ButtonGlyph'
import { Container } from '../ui/Container'
import { WhatsAppIcon } from '../ui/icons'
import { TriangleOutline } from '../ui/TriangleOutline'

const serviceOptions = [...serviceIds, 'other'] as const

type RequiredField = 'name' | 'phone'
type FieldErrors = Partial<Record<RequiredField, boolean>>

/** Same rules the inputs used to enforce natively, checked by hand so errors can sit under each field. */
function findErrors(data: FormData): FieldErrors {
  const name = String(data.get('name') ?? '').trim()
  const phoneDigits = String(data.get('phone') ?? '').replace(/\D/g, '')
  return { name: name.length === 0, phone: phoneDigits.length < 7 }
}

export function Contact() {
  const { t, alt } = useI18n()
  const { contact } = t
  const { form } = contact
  const formRef = useRef<HTMLFormElement>(null)
  const uid = useId()
  const fieldId = (name: string) => `${uid}-${name}`
  const errorId = (name: RequiredField) => `${uid}-${name}-error`
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  /** Shows errors under the fields and moves focus to the first one. Returns true when the form can be sent. */
  function validate(formElement: HTMLFormElement): boolean {
    const found = findErrors(new FormData(formElement))
    setErrors(found)
    const first = (['name', 'phone'] as const).find((field) => found[field])
    if (!first) return true
    formElement.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus()
    return false
  }

  function clearError(field: RequiredField) {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: false }))
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
    } catch {
      // Clipboard can be blocked; the address is printed right beside the button.
    }
  }

  /** Turns the form into a plain-text message for email or WhatsApp. */
  function composeMessage(data: FormData) {
    const service = form.serviceOptions[data.get('service') as (typeof serviceOptions)[number]]
    const lines = [
      `${form.name}: ${data.get('name')}`,
      `${form.phone}: ${data.get('phone')}`,
      `${form.service}: ${service}`,
      '',
      `${form.message}:`,
      String(data.get('message') ?? ''),
    ]
    return { subject: `${form.emailSubject}: ${service}`, body: lines.join('\n') }
  }

  function sendEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate(event.currentTarget)) return
    const { subject, body } = composeMessage(new FormData(event.currentTarget))
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
    setCopied(false)
  }

  function sendWhatsapp() {
    const formElement = formRef.current
    if (!formElement || !validate(formElement)) return
    const { subject, body } = composeMessage(new FormData(formElement))
    const text = encodeURIComponent(`${subject}\n\n${body}`)
    window.open(`https://wa.me/${site.whatsapp}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const fieldCell = 'flex flex-col gap-1.5 border-b border-line px-5 py-4 focus-within:bg-bone focus-within:shadow-[inset_3px_0_0_var(--color-ink)] rtl:focus-within:shadow-[inset_-3px_0_0_var(--color-ink)]'
  const invalidCell = 'shadow-[inset_3px_0_0_var(--color-brand)] rtl:shadow-[inset_-3px_0_0_var(--color-brand)]'
  const errorClass = 'text-[13px] leading-snug font-semibold text-crimson'
  const labelClass = 'label text-slate'
  const inputClass = 'w-full bg-transparent py-1 text-[17px] text-ink outline-none placeholder:text-slate'

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-brand text-white">
      <TriangleOutline
        className="-bottom-40 w-[520px] ltr:-left-32 rtl:-right-32"
        color="#ffffff"
        strokeWidth={22}
        opacity={0.3}
      />

      <Container className="relative grid gap-12 py-16 sm:py-24 lg:grid-cols-12 lg:gap-12">
        <div data-reveal className="flex flex-col gap-6 lg:col-span-5">
          <p className="label">
            <span className="code">06</span> · {contact.label} /{' '}
            <span lang={t.languageSwitch.target}>{alt.contact.label}</span>
          </p>
          <h2 id="contact-title" className="display-xl">
            {contact.title}
          </h2>
          <p className="max-w-[26rem] text-lg leading-relaxed text-pretty">{contact.lede}</p>

          <dl className="mt-4 grid gap-0 border-t border-white/40">
            <div className="flex flex-col gap-1 border-b border-white/40 py-4">
              <dt className="label opacity-80">{contact.details.office}</dt>
              <dd>
                <a
                  href={site.address.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/50 decoration-2 underline-offset-4 hover:decoration-white"
                >
                  {contact.details.address[0]}
                  <br />
                  {contact.details.address[1]}
                </a>
                <span className="sr-only"> ({contact.details.openMap})</span>
              </dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-white/40 py-4">
              <dt className="label opacity-80">{contact.details.phone}</dt>
              <dd className="flex flex-wrap gap-x-6 gap-y-1">
                {site.phones.map((phone) => (
                  <a key={phone.href} href={phone.href} className="code inline-flex min-h-11 items-center text-[15px] hover:underline">
                    {phone.display}
                  </a>
                ))}
              </dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-white/40 py-4">
              <dt className="label opacity-80">{contact.details.email}</dt>
              <dd>
                <a href={`mailto:${site.email}`} className="code inline-flex min-h-11 items-center text-[15px] hover:underline">
                  {site.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <form
          ref={formRef}
          onSubmit={sendEmail}
          noValidate
          data-reveal
          className="self-start border border-ink bg-sheet text-ink lg:col-span-7"
        >
          <h3 className="label flex justify-between border-b border-ink px-5 py-3">
            <span>{form.heading}</span>
            <span className="code text-slate">{site.portCode}</span>
          </h3>

          <div className="grid sm:grid-cols-2">
            <div className={cn(fieldCell, 'sm:border-e', errors.name && invalidCell)}>
              <label htmlFor={fieldId('name')} className={labelClass}>
                01 · {form.name}
              </label>
              <input
                id={fieldId('name')}
                name="name"
                type="text"
                autoComplete="name"
                required
                aria-invalid={errors.name || undefined}
                aria-describedby={errors.name ? errorId('name') : undefined}
                onInput={() => clearError('name')}
                className={inputClass}
              />
              {errors.name && (
                <p id={errorId('name')} className={errorClass}>
                  {form.errors.name}
                </p>
              )}
            </div>
            <div className={cn(fieldCell, errors.phone && invalidCell)}>
              <label htmlFor={fieldId('phone')} className={labelClass}>
                02 · {form.phone}
              </label>
              <input
                id={fieldId('phone')}
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                dir="ltr"
                required
                aria-invalid={errors.phone || undefined}
                aria-describedby={errors.phone ? errorId('phone') : undefined}
                onInput={() => clearError('phone')}
                className={cn(inputClass, 'code rtl:text-right')}
              />
              {errors.phone && (
                <p id={errorId('phone')} className={errorClass}>
                  {form.errors.phone}
                </p>
              )}
            </div>
            <div className={cn(fieldCell, 'sm:col-span-2')}>
              <label htmlFor={fieldId('service')} className={labelClass}>
                03 · {form.service}
              </label>
              <select id={fieldId('service')} name="service" defaultValue="customs" className={cn(inputClass, 'cursor-pointer')}>
                {serviceOptions.map((option) => (
                  <option key={option} value={option}>
                    {form.serviceOptions[option]}
                  </option>
                ))}
              </select>
            </div>
            <div className={cn(fieldCell, 'sm:col-span-2')}>
              <label htmlFor={fieldId('message')} className={labelClass}>
                04 · {form.message}
              </label>
              <textarea
                id={fieldId('message')}
                name="message"
                rows={4}
                placeholder={form.messagePlaceholder}
                className={cn(inputClass, 'resize-y')}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2">
            <button type="submit" className={buttonStyles('ink', 'h-16 w-full cursor-pointer justify-between px-5')}>
              {form.sendEmail}
              <span className="text-flare">
                <ButtonGlyph />
              </span>
            </button>
            <button
              type="button"
              onClick={sendWhatsapp}
              className={buttonStyles(
                'outline',
                'h-16 w-full cursor-pointer justify-between border-x-0 border-b-0 px-5 sm:border-s-2 sm:border-t-0',
              )}
            >
              {form.sendWhatsapp}
              <WhatsAppIcon />
            </button>
          </div>
          <div role="status">
            {sent && (
              <div className="flex flex-col gap-3 border-t border-ink bg-bone px-5 py-4">
                <p className="flex items-center gap-2 font-bold">
                  <span aria-hidden="true" className="size-2 shrink-0 bg-brand" />
                  {form.sent.title}
                </p>
                <p className="text-[15px] leading-relaxed text-deck text-pretty">{form.sent.body}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <button
                    type="button"
                    onClick={copyEmail}
                    className={buttonStyles('outline', 'h-11 cursor-pointer px-4 text-[13px]')}
                  >
                    {copied ? form.sent.copied : form.sent.copyEmail}
                  </button>
                  <span className="code text-sm select-all">{site.email}</span>
                </div>
              </div>
            )}
          </div>
          <p className="border-t border-line px-5 py-3 text-[13px] leading-snug text-slate">{form.note}</p>
        </form>
      </Container>
    </section>
  )
}
