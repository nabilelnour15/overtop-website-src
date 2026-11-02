import type { ReactNode } from 'react'
import type { ServiceId } from '../../config/site'
import { useI18n } from '../../i18n/context'
import type { ProductCopy } from '../../i18n/types'
import { cn } from '../../lib/cn'
import { buttonStyles } from '../ui/button'
import { ButtonGlyph } from '../ui/ButtonGlyph'
import { Container } from '../ui/Container'
import { ImageSlot } from '../ui/ImageSlot'

interface ServiceSectionProps {
  id: ServiceId
  tone?: 'bone' | 'ink'
  /** Put the image column first on wide screens, for rhythm down the page. */
  flip?: boolean
  /** Full-width content under the two columns (e.g. the route steps). */
  footer?: ReactNode
}

/** One service: title, what we handle, a photo slot and, where there is one, a featured product. */
export function ServiceSection({ id, tone = 'bone', flip = false, footer }: ServiceSectionProps) {
  const { t } = useI18n()
  const service = t.services[id]
  const dark = tone === 'ink'

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('py-16 sm:py-24', dark ? 'bg-ink text-bone' : 'border-t border-ink')}
    >
      <Container>
        <h2 id={`${id}-title`} data-reveal className="display-l max-w-[56rem] border-t-2 border-current pt-8 pb-12 lg:pb-16">
          {service.title} <span className={dark ? 'text-flare' : 'text-brand'}>{service.titleAccent}</span>
        </h2>

        <div data-reveal className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className={cn('lg:col-span-7', flip && 'lg:order-2')}>
            <h3 className={cn('label mb-4', dark ? 'text-fog' : 'text-slate')}>{service.scopeHeading}</h3>
            <ol className={cn('border-t-2', dark ? 'border-bone' : 'border-ink')}>
              {service.scope.map((item) => (
                <li
                  key={item.title}
                  className={cn(
                    'grid gap-x-6 gap-y-1 border-b py-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]',
                    dark ? 'border-deck' : 'border-line',
                  )}
                >
                  <span className="text-lg leading-snug font-bold">{item.title}</span>
                  <span className={cn('text-[15px] leading-relaxed text-pretty', dark ? 'text-fog' : 'text-deck')}>
                    {item.body}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className={cn('flex flex-col gap-6 lg:col-span-5', flip && 'lg:order-1')}>
            <ImageSlot
              slot={id}
              alt={service.imageAlt}
              tone={dark ? 'ink' : 'concrete'}
              className="aspect-[4/3] w-full"
            />
            {service.imageAlt2 && (
              <ImageSlot
                slot="lashing"
                alt={service.imageAlt2}
                tone={dark ? 'ink' : 'concrete'}
                className="aspect-[4/3] w-full"
              />
            )}
          </div>
        </div>

        {service.product && <ProductBlock product={service.product} />}

        {footer && <div data-reveal className="pt-16 sm:pt-20">{footer}</div>}
      </Container>
    </section>
  )
}

/** Sends the visitor to the quote form with this service already chosen. */
function chooseServiceInForm(service: ServiceId) {
  const select = document.querySelector<HTMLSelectElement>('#contact select[name="service"]')
  if (select) select.value = service
}

const gallerySlots = ['productDetail', 'productWrapped', 'productCrate'] as const

/** A featured product: photo, standard tag, spec sheet and a quote button. */
function ProductBlock({ product }: { product: ProductCopy }) {
  return (
    <div data-reveal className="mt-16 grid gap-10 border-t-2 border-ink pt-8 sm:mt-20 lg:grid-cols-12 lg:gap-10">
      <div className="flex flex-col gap-3 lg:col-span-5">
        <ImageSlot slot="product" alt={product.imageAlt} className="aspect-[4/3] w-full" />
        <div className="grid grid-cols-3 gap-3">
          {gallerySlots.map((slot, index) => (
            <ImageSlot key={slot} slot={slot} alt={product.galleryAlts[index]} className="aspect-[4/3] w-full" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:col-span-7">
        <div className="flex flex-col gap-3">
          <h3 className="label text-slate">{product.heading}</h3>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <p className="display-m">{product.name}</p>
            <span className="code border border-ink px-2 py-1 text-xs">{product.standard}</span>
          </div>
          <p className="max-w-[38rem] text-lg leading-relaxed text-deck text-pretty">{product.description}</p>
        </div>

        <dl className="border-t-2 border-ink">
          {product.specs.map((spec) => (
            <div
              key={spec.label}
              className="grid gap-x-6 gap-y-1 border-b border-line py-3 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]"
            >
              <dt className="label text-slate">{spec.label}</dt>
              <dd className="text-[15px] leading-snug">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <a
          href="#contact"
          onClick={() => chooseServiceInForm('export')}
          className={buttonStyles('primary', 'h-[60px] w-full justify-between sm:w-fit sm:justify-center')}
        >
          {product.cta}
          <ButtonGlyph />
        </a>
      </div>
    </div>
  )
}
