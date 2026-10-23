import { useId, useRef, type FormEvent } from 'react'
import { serviceIds, site } from '../../config/site'
import { useI18n } from '../../i18n/context'
import { cn } from '../../lib/cn'
import { buttonStyles } from '../ui/button'
import { ButtonGlyph } from '../ui/ButtonGlyph'
import { Container } from '../ui/Container'
import { WhatsAppIcon } from '../ui/icons'
import { TriangleOutline } from '../ui/TriangleOutline'

const serviceOptions = [...serviceIds, 'other'] as const

export function Contact() {
  const { t, alt } = useI18n()
  const { contact } = t
  const { form } = contact
  const formRef = useRef<HTMLFormElement>(null)
  const uid = useId()
  const fieldId = (name: string) => `${uid}-${name}`

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
    const { subject, body } = composeMessage(new FormData(event.currentTarget))
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  function sendWhatsapp() {
    const formElement = formRef.current
    if (!formElement?.reportValidity()) return
    const { subject, body } = composeMessage(new FormData(formElement))
    const text = encodeURIComponent(`${subject}\n\n${body}`)
    window.open(`https://wa.me/${site.whatsapp}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const fieldCell = 'flex flex-col gap-1.5 border-b border-line px-5 py-4 focus-within:bg-bone focus-within:shadow-[inset_3px_0_0_var(--color-ink)] rtl:focus-within:shadow-[inset_-3px_0_0_var(--color-ink)]'
  const labelClass = 'label text-[11px] text-slate'
  const inputClass = 'w-full bg-transparent py-1 text-[17px] text-ink outline-none placeholder:text-fog'

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-brand text-white">
      <TriangleOutline
        className="-bottom-40 w-[520px] ltr:-left-32 rtl:-right-32"
        color="#ffffff"
        strokeWidth={22}
        opacity={0.3}
      />

      <Container className="relative grid gap-12 py-16 sm:py-24 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
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
              <dt className="label text-[11px] opacity-80">{contact.details.office}</dt>
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
              <dt className="label text-[11px] opacity-80">{contact.details.phone}</dt>
              <dd className="flex flex-wrap gap-x-6 gap-y-1">
                {site.phones.map((phone) => (
                  <a key={phone.href} href={phone.href} className="code text-[15px] hover:underline">
                    {phone.display}
                  </a>
                ))}
              </dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-white/40 py-4">
              <dt className="label text-[11px] opacity-80">{contact.details.email}</dt>
              <dd>
                <a href={`mailto:${site.email}`} className="code text-[15px] hover:underline">
                  {site.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <form
          ref={formRef}
          onSubmit={sendEmail}
          className="self-start border border-ink bg-sheet text-ink lg:col-span-7"
        >
          <h3 className="label flex justify-between border-b border-ink px-5 py-3">
            <span>{form.heading}</span>
            <span className="code text-slate">{site.portCode}</span>
          </h3>

          <div className="grid sm:grid-cols-2">
            <div className={cn(fieldCell, 'sm:border-e')}>
              <label htmlFor={fieldId('name')} className={labelClass}>
                01 · {form.name}
              </label>
              <input id={fieldId('name')} name="name" type="text" autoComplete="name" required className={inputClass} />
            </div>
            <div className={fieldCell}>
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
                minLength={7}
                className={cn(inputClass, 'code rtl:text-right')}
              />
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
          <p className="border-t border-line px-5 py-3 text-[13px] leading-snug text-slate">{form.note}</p>
        </form>
      </Container>
    </section>
  )
}
