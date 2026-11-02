# Overtop website: change request (structured prompt)

Paste everything below the line into Claude Code, run from `D:\Overtop`.

---

## Role and context

You are editing the Overtop website in `D:\Overtop\website` (Vite + React + TypeScript, bilingual EN/AR, prerendered, deployed to GitHub Pages). Overtop is an Egyptian company doing **export, import, transport/logistics and customs services**, operating **since 2017**, through **all Egyptian ports and airports**, not only Alexandria.

Copy lives in `src/i18n/en.ts` and `src/i18n/ar.ts` (typed by `types.ts`). Every text change must be made in **both languages** and keep the types in sync. Follow the existing code style and comment density. Do not commit; show me the diff summary when done.

## Global rules

1. **Remove every Alexandria reference.** Search the whole repo (`en.ts`, `ar.ts`, `site.ts`, `index.html`, `seo/head.ts`, `TradeLanes.tsx`, `trade-lanes.ts`, `index.css`, `scripts/share-card/*`, `README.md`, `IMAGE-PROMPTS.md`, alt texts, meta/OG/JSON-LD). Replace with "Egyptian ports" / "all ports in Egypt" wording. The only exception is the office street address in the contact section, which is a real address, so keep it as is.
2. **Add "Since 2017"** (EN) / "منذ 2017" (AR) in: the hero, the About section, and the meta description.
3. Update `meta.title`, `description`, `shareTitle`, `shareDescription`, `shareImageAlt` to match (no Alexandria), then regenerate the share cards in `scripts/share-card/` for both languages.

## Task 1: Hero

- Replace the title "From the quay to your door." (`hero.titleLines` / `titleAccent`). Propose 3 options in EN and AR and use the first unless I say otherwise. Suggested direction: all ports, sea and air, door to door. Example: "Every Egyptian port. Straight to your door."
- Remove the eyebrow line "Export · Import · Transport · Custom services / تصدير · استيراد · نقل · تخليص جمركي" (`hero.eyebrow`).
- Update `lede` and `imageAlt` (no Alexandria).

## Task 2: Section headers

- Remove the small eyebrow text at the start of each section (the `SectionMarker` label/altLabel, e.g. "Export · Import · Transport · Custom services" and its Arabic line), plus the number/label strip if it only repeats that text. Keep the real section titles.
- Remove the footer tagline `footer.tagline` for the same reason.
- Remove the `lede` paragraph next to each service heading (for example Import: "We prepare the file before your goods sail…"). Keep that kind of description **only** in the Services overview (`ServicesIndex`). Adjust the heading grid in `ServiceSection.tsx` so the title is not left with an empty column.

## Task 3: Service sections: remove clutter

- Remove the small documents table under each image (`DocumentSheet` in `ServiceSection.tsx`) and the `documents` data in both i18n files and in `types.ts`.
- Remove the index codes: `EXP.1`, `IMP.1`, `TRN.x`, `CUS.x` on the scope rows and `D-CUS-1` style codes, and the now-unused `serviceCodes` in `config/site.ts` if nothing else uses them. Keep the numbered layout clean without them.

## Task 4: Transportation + Logistics (one section)

Merge logistics into the **Transportation** section (keep nav id `transport`; rename the label to "Transportation & Logistics" / "النقل واللوجستيات"). Scope items:

- **Door to door**, **Port to door**, **Door to port**.
- **Cargo handling**, **containers** (20 ft / 40 ft / high-cube, reefer where needed), **packing**, **lashing and securing**.
- **All modes of transport**: sea freight (FCL/LCL, bulk, break-bulk), air freight, road trucking, and inland/rail where applicable.
- Keep updates-on-the-way and loading coordination if space allows.

Each item: short title + one-sentence body, EN and AR. Update `imageAlt`, nav, contact-form service options, `meta.serviceNames`, and the SEO text.

## Task 5: Customs

Add **customs consulting** as a scope item (advice on classification, duties, procedures, documentation and compliance before the shipment moves). Keep the existing items. State that we advise as well as clear.

## Task 6: Export: add the copper wire product

Add a featured product block inside the Export section (title, spec list, short description, one image slot):

- **Copper wire rod, 8 mm**, standard reference **EN 12166** (as given by the company; see note below).
- Details to show, reasonable and non-binding: material Cu-ETP (electrolytic tough pitch copper), purity 99.90% Cu min, nominal diameter 8 mm, supplied in coils on wooden pallets, bright red-orange surface, used for drawing into electrical wire and cable, motors and transformers. Packing: strapped and wrapped coils, export-sea-worthy. Offered through all Egyptian ports.
- Add a "Request a quote for this product" button that pre-selects Export in the contact form.
- **Note to verify, do not invent claims:** the standard normally cited for 8 mm continuous-cast copper rod is **EN 1977** (grade CW004A); **EN 12166** covers copper wire for general purposes. Use EN 12166 as I specified, but add a TODO comment and mention it in your final summary so I can confirm with the factory's certificate. Do not add certifications, tonnage, prices or capacities that I have not given you.

## Task 7: Trade-lanes map becomes a 3D globe

Replace the flat halftone map (`TradeLanes.tsx`, `trade-lanes.ts`, `ui/halftone-routes.tsx`) with a **spherical, rotatable globe**:

- Draw land as dots or outlines on a sphere. Prefer a small dependency-free approach (canvas or SVG with orthographic projection) or a light library such as `d3-geo`; keep the bundle small, and it must prerender safely (no `window` access at import time).
- Auto-rotate slowly; drag to rotate; pause when the user interacts; respect `prefers-reduced-motion` (static globe).
- Show **great-circle routes from Egypt's ports to major world ports** across all continents (for example Port Said, Damietta, Alexandria, Ain Sokhna, Safaga, Cairo airport on the Egypt side; and Rotterdam, Antwerp, Hamburg, Genoa, Valencia, Piraeus, Istanbul, New York, Houston, Santos, Jeddah, Jebel Ali, Mumbai, Mombasa, Durban, Lagos, Colombo, Singapore, Shanghai, Hong Kong, Busan, Tokyo, Sydney, Vancouver on the world side). Add an air-route style (dashed arcs) for air cargo.
- Update the legend, `mapLabel` (accessible description) and hint text, and remove the single-port "One port" title; use wording like "All Egyptian ports. Lanes to every continent."
- Keep EN/AR labels for ports; keep a text fallback for screen readers.

## Task 8: Images

Rewrite `IMAGE-PROMPTS.md` and generate matching prompts, keeping the existing Style block and Negative prompt rules (editorial architectural photography, one signal-red #DC0023 accent, no text or logos) but **shift the subjects to sea and air shipping**, with no Alexandria:

- **Hero:** huge container ship under way / entering a deep-water port, stacks of containers, gantry cranes, with an Overtop-red container; optionally a cargo aircraft in the sky.
- **Import:** large container vessel being unloaded at a modern Egyptian terminal.
- **Export:** container loading with the copper-coil product visible (see below) and a ship in the background.
- **Transportation & Logistics:** a split story: ship at berth, freight aircraft at an air-cargo apron with ULDs, and a truck leaving the port; also a lashing/securing close-up.
- **Customs:** inspection bay, as now, without Alexandria cues.
- **About:** office with a window onto a port and a vessel; remove Alexandria cues.
- **Product image (copper wire rod, 8 mm):** write 3 prompts in the same style as the generated images in `D:\Overtop\images\` (clean, bright, photoreal, restrained palette): (1) studio/warehouse hero shot of several bright copper wire-rod coils on a wooden pallet, strapped and wrapped, tidy and symmetrical; (2) close-up macro of the coil winding and bright copper surface, shallow depth of field; (3) coils being loaded into a container at a port. No text, no labels, no brand marks. Note the real copper colour (bright salmon-orange metallic, not red, not gold), so keep it distinct from the signal-red accent.
- The folder named "proudect" does not exist in the repo. Use `D:\Overtop\images\` as the style reference and tell me if you meant another folder.
- Update focus points and alt texts in `src/content/images.ts` and the i18n files; list the new file names and sizes I must produce into `website/public/images/`.

## Acceptance checklist

- [ ] `grep -ri alexandria` returns only the contact address.
- [ ] No eyebrow strips, no per-section ledes, no document tables, no `EXP.1` / `IMP.1` / `D-XXX-1` codes remain.
- [ ] EN and AR both updated, RTL layout intact, `types.ts` compiles.
- [ ] "Since 2017" appears in hero, About and meta.
- [ ] Transportation & Logistics merged with the listed items; Customs has consulting; Export has the copper wire rod 8 mm / EN 12166 block.
- [ ] Globe renders, rotates, drags, respects reduced motion, and prerenders without errors.
- [ ] `npm run build` and the lint script pass; check desktop and phone widths in both languages.
- [ ] Final summary lists anything I must confirm (title choice, EN 12166 vs EN 1977, new images).
