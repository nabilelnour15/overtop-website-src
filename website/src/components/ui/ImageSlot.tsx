import { site } from '../../config/site'
import { images, type ImageSlotId } from '../../content/images'
import { cn } from '../../lib/cn'
import { TriangleOutline } from './TriangleOutline'

interface ImageSlotProps {
  slot: ImageSlotId
  alt: string
  /** Caption code shown in the corner, e.g. "FIG. 01". */
  figure: string
  tone?: 'concrete' | 'ink'
  className?: string
  /** Load eagerly for above-the-fold images. */
  priority?: boolean
  /** Keep the cropped triangle over the photo too, not just the placeholder. */
  accent?: boolean
}

/**
 * A photo when one is configured in content/images.ts; until then a branded
 * graphic panel (cropped triangle + port code), so the page never looks unfinished.
 */
export function ImageSlot({ slot, alt, figure, tone = 'concrete', className, priority, accent }: ImageSlotProps) {
  const image = images[slot]
  const dark = tone === 'ink'

  return (
    <figure
      className={cn(
        'relative isolate overflow-hidden border',
        dark ? 'border-deck bg-hull' : 'border-ink bg-concrete',
        className,
      )}
    >
      {image ? (
        <img
          src={image.src}
          alt={alt}
          width={1408}
          height={768}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          style={{ objectPosition: image.position }}
          className="absolute inset-0 h-full w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
        />
      ) : null}
      {image && accent ? (
        <TriangleOutline
          className="-bottom-[22%] w-[46%] max-w-[480px] ltr:-right-[6%] rtl:-left-[6%]"
          strokeWidth={22}
        />
      ) : null}
      {image ? null : (
        <>
          <TriangleOutline
            className="-bottom-[18%] w-[70%] max-w-[520px] ltr:-right-[8%] rtl:-left-[8%]"
            color={dark ? 'var(--color-flare)' : 'var(--color-brand)'}
            strokeWidth={22}
            opacity={dark ? 0.55 : 0.9}
          />
          <span
            aria-hidden="true"
            className={cn(
              'numeral absolute top-4 text-[clamp(4rem,10vw,8rem)] ltr:left-4 rtl:right-4',
              dark ? 'text-deck' : 'text-line',
            )}
          >
            {site.portCode}
          </span>
        </>
      )}
      <figcaption
        className={cn(
          'code absolute bottom-0 flex w-full justify-between gap-4 px-4 py-3 text-[11px] tracking-[0.06em]',
          dark ? 'text-fog' : 'text-slate',
          image && 'bg-ink/75 text-bone',
        )}
      >
        <span>{figure}</span>
        <span>{site.coordinates}</span>
      </figcaption>
    </figure>
  )
}
