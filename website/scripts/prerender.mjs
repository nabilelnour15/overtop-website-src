// Turns the built single-page app into one finished HTML page per language
// (dist/index.html, dist/ar/index.html), so search engines and link previews
// (WhatsApp, Facebook, X…) see real text and the right tags without running
// JavaScript. Also writes sitemap.xml and robots.txt. Runs after both vite builds.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')

const { renderPage, locales, pageUrl, site } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)
const template = await readFile(join(dist, 'index.html'), 'utf8')

function fill(placeholder, value, html) {
  if (!html.includes(placeholder)) throw new Error(`index.html is missing ${placeholder}`)
  return html.replace(placeholder, () => value)
}

for (const locale of locales) {
  const page = renderPage(locale)
  let html = template.replace('<html lang="en" dir="ltr">', `<html lang="${page.lang}" dir="${page.dir}">`)
  html = fill('<!--app-head-->', page.head, html)
  html = fill('<!--app-html-->', page.html, html)

  const outDir = join(dist, page.folder)
  await mkdir(outDir, { recursive: true })
  await writeFile(join(outDir, 'index.html'), html)
  console.log(`prerendered ${pageUrl(locale)}`)
}

const today = new Date().toISOString().slice(0, 10)
const alternates = locales
  .map((each) => `    <xhtml:link rel="alternate" hreflang="${each}" href="${pageUrl(each)}" />`)
  .join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${locales
  .map(
    (locale) => `  <url>
    <loc>${pageUrl(locale)}</loc>
    <lastmod>${today}</lastmod>
${alternates}
  </url>`,
  )
  .join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap)
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', site.url).href}\n`)
console.log('wrote sitemap.xml and robots.txt')

await rm(ssrDir, { recursive: true, force: true })
