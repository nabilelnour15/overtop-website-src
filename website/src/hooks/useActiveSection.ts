import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently under the sticky header,
 * so the nav can mark where the visitor is on the page.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const visible = new Map<string, boolean>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting)
        // The first section in page order that crosses the reading band wins.
        setActive(ids.find((id) => visible.get(id)) ?? null)
      },
      // A thin band ~30% down the viewport acts as the "reading line".
      { rootMargin: '-30% 0px -65% 0px' },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
