# Overtop website

One-page site for Overtop — export, import, transport and custom services, Alexandria.
English and Arabic (RTL), built on the **Overtop Design System** canvas.

Stack: Vite · React 19 · TypeScript · Tailwind CSS v4. No backend.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run lint
```

## Where things live

| Change… | Edit |
| --- | --- |
| Phone, email, address, WhatsApp number | `src/config/site.ts` |
| Any English text | `src/i18n/en.ts` |
| Any Arabic text | `src/i18n/ar.ts` |
| Photos | `public/images/` + `src/content/images.ts` (prompts: `../IMAGE-PROMPTS.md`) |
| Colours, fonts, type sizes | `src/index.css` (`@theme` tokens and `display-*` / `label` / `code` utilities) |
| Logos | `public/brand/` |

```
src/
  config/site.ts          company facts + section order
  content/images.ts       photo slots (null = branded placeholder graphic)
  i18n/                   types.ts (shape every language must match), en.ts, ar.ts, provider
  components/
    ui/                   Container, SectionMarker, ImageSlot, buttons, icons, triangle
    layout/               UtilityBar, Header (+ mobile menu), LanguageToggle, Footer
    sections/             Hero, ServicesIndex, ServiceSection, RouteSteps, About, Contact
  App.tsx                 page order
```

## Languages

- English is served at `/`, Arabic at `/ar/` (old `?lang=ar` links redirect there).
- `npm run build` pre-renders both pages (`scripts/prerender.mjs`) with their search and share tags (`src/seo/head.ts`) and writes `sitemap.xml` + `robots.txt`.
- The public address lives in `.env` (`VITE_SITE_URL`).
- Share cards and app icons: edit `scripts/share-card/card.html`, then run `python scripts/share-card/make_share_images.py`.
- `Dictionary` in `src/i18n/types.ts` is the contract: a missing translation is a build error.
- Use logical Tailwind classes (`ms-`, `pe-`, `border-s`, `ltr:` / `rtl:`) instead of left/right so the layout mirrors on its own.
- Phone numbers, codes and emails use the `code` utility, which keeps them left-to-right inside Arabic text.

## Contact form

The form has no server. **Send by email** opens the visitor's mail app with the message pre-filled to the company address; **Send on WhatsApp** opens a WhatsApp chat with the same text. To receive submissions directly later, swap `sendEmail` in `src/components/sections/Contact.tsx` for a request to a form service or your own API.

## Growing it

- **More pages** (e.g. a page per service): add `react-router`, move each `<ServiceSection>` into its own route; the dictionaries and components are already split per service.
- **Another language**: add `src/i18n/<code>.ts` typed as `Dictionary`, add the code to `locales` in `types.ts`, and to `rtlLocales` if it reads right-to-left.

## Deploying

`npm run build` produces static files in `dist/` that work on any static host (Netlify, Vercel, Cloudflare Pages, cPanel).
