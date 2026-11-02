# Overtop: AI image prompts

Six photos for the website, plus the copper product images below. Each one replaces a red-triangle placeholder panel. Direction: modern, clean, orderly, forward-looking Egyptian sea and air logistics, shot like editorial architectural photography.

## How to use

1. In your image generator (Midjourney, Nano Banana / Gemini, GPT-Image, Flux), attach the reference images from `D:\Overtop\ref images\` (`overtop-logo.png`, `overtop-mark.png`). Add real photos of your trucks, office or port to the same folder and attach those too: the closer to reality, the less "AI" the result looks.
2. Paste the **Style block** first, then the prompt for the image, then the **Negative prompt** (or its equivalent "avoid" field).
3. Save as **.webp** (or .jpg), at least the size listed, into `website/public/images/` with the file name shown.
4. In `website/src/content/images.ts`, set the path, e.g. `hero: '/images/hero.webp'`.

The site displays every photo cropped to fill its frame (`object-cover`), with a caption bar along the bottom edge. Keep the key subject away from the bottom 10% and leave calm space around it. Focus points set in `images.ts`: hero 50% 55%, import 58% 50%, export 72% 50%, transport 50% 50%, customs 68% 50%, about 62% 50%.

---

## Style block (paste before every prompt)

> Editorial architectural photograph of modern, contemporary Egyptian logistics, shot on a full-frame camera with a 35mm tilt-shift lens, perfectly level verticals, crisp natural daylight or clean blue hour. Forward-looking Egypt: modernised port terminals and air-cargo aprons, wide clean quays, new highways and logistics zones, with subtle solar panels or wind turbines far in the background where it fits. Everything is new, orderly, spotless and well lit. Restrained palette of white, light grey, concrete and glass, with exactly one accent of signal red (#DC0023) as a solid block: an Overtop-red container, truck cab or stripe. Generous negative space, calm symmetrical composition. People wear clean professional workwear and PPE (white hard hats, hi-vis vests, tidy uniforms), candid and natural, never posing. Photorealistic, natural skin and material textures, sharp focus, not CGI, not a render. Blank container doors and plain truck panels, no text, no letters or numbers, no logos, no signage, no watermarks.

## Negative prompt

> dirt, grime, rust, dust, haze, smog, litter, puddles, peeling paint, graffiti, oil stains, clutter, chaos, crowds, crowded old streets, gritty look, desaturated documentary look, CGI, 3D render, sci-fi, futuristic neon, HDR, lens flare, fisheye, text, lettering, logos, signage, watermark, orange or pink red, more than one red object

---

## 1. Hero: `hero.webp`: 2400 × 1000 (wide, 12:5)

> Wide, low-angle shot of a huge modern container ship under way at the entrance to a deep-water Egyptian port on a bright, clean morning, containers stacked high in white, grey and pale blue with a single Overtop-red container on the top tier. Sleek ship-to-shore gantry cranes on the quay beside it, a clear sky, and a cargo aircraft climbing far above the port. Calm, symmetrical, lots of open water and sky; horizon in the upper third.

## 2. Import: `import.webp`: 1600 × 1200 (4:3)

> A large container ship alongside a modern Egyptian terminal, a container lifted off its deck by a ship-to-shore gantry crane. The container in mid-air is Overtop red; every other container is white, grey or pale blue, perfectly stacked. Two port workers in white hard helmets and hi-vis vests at a safe distance, one with a tablet. Clear blue sky, dry pale concrete quay, open space on the left.

## 3. Export: `export.webp`: 1600 × 1200 (4:3)

> A modern port quay: an open 40 ft container being loaded with white-wrapped pallets and strapped copper wire-rod coils by a clean electric forklift, a container ship moored behind it with gantry cranes. Overtop-red truck cab at the dock. Workers in clean uniforms and hard hats. Bright, tidy, symmetrical, subject right of centre.

## 4. Transport & Logistics: `transport.webp`: 1600 × 1200 (4:3)

> One calm composition of the whole chain: in the foreground an Overtop-red truck cab pulling a light-grey container on a clean new highway at blue hour; behind it a container ship at berth under gantry cranes, and a freight aircraft on an air-cargo apron with loaded cargo pallets. Solar panels and slim lighting masts along the horizon. Wide empty space around the truck.

## 4b. Lashing detail (optional second photo): 1600 × 1200 (4:3)

> Close, chest-height documentary shot inside an open container: wooden crates and pallets braced with timber, ratchet straps and lashing bars, a worker in a hard hat and hi-vis vest tightening a strap. Soft white daylight from the open doors, clean floor, one red strap as the only red accent.

## 5. Customs Services: `customs.webp`: 1600 × 1200 (4:3)

> Customs inspection at a modern port logistics hall. A container stands open on a clean, brightly lit inspection bay with glass-and-steel architecture behind. An inspector and an Overtop agent in a tidy dark jacket with a small red triangle badge check cartons against a tablet. Chest-height documentary framing: hands, tablet and neatly aligned cartons in focus, faces partly turned away. Soft white daylight, pale polished concrete floor, restrained greys, uncluttered.

## 6. About Us: `about.webp`: 1600 × 1200 (4:3)

> A contemporary glass-and-steel office. A clean white desk with a laptop, a tablet, a phone and a tidy stack of documents. Floor-to-ceiling window behind, with a sharp view of a modern port, gantry cranes, a container ship and a red container on the quay. One professional on a call, seen from the side, in a crisp white shirt. Bright natural light, white and light-grey interior, one small red accent object on the desk, generous empty space on the left.

---

## Product images: copper wire rod, 8 mm

Reference: the three phone screenshots in `images/proudct/` show the look to match. They are other companies' ads (with app interface and logos), so use them only as a guide to subject and colour, never on the site. Copper is a warm salmon-orange metallic, not red and not gold, so it stays distinct from the signal-red accent. Save the first as `public/images/copper-wire.webp` (1600 × 1200) and point `images.product` at it in `src/content/images.ts`. Add to the Style block: "blank pallets and packaging, no printed labels, no text".

**Product A: pallet of coils (main image, `copper-wire.webp`).**

> Several large coils of bright copper wire rod, 8 mm, stacked two high on wooden pallets in a clean, bright export warehouse. Each coil is tightly wound, with neat parallel strands, a warm polished salmon-copper sheen, bound with flat steel straps. Polished light-grey concrete floor, tall windows with soft daylight, orderly rows behind, symmetrical, subject centred with open space around it. Photorealistic, sharp focus, no text, no labels.

**Product B: shrink-wrapped coils, packing.**

> Two tall stacked coils of bright copper wire rod wrapped in clear protective film and strapped, standing on a clean concrete floor inside a modern factory hall, large windows behind with soft daylight. The film catches the light; the winding of the copper is visible through it. Low three-quarter angle, calm, spotless, a pale concrete wall behind, no text, no labels.

**Product C: crate and inspection.**

> Open pale-wood export crate holding four neatly wound coils of bright copper wire rod, a worker in a white hard hat and hi-vis vest checking the strapping with a tablet, in a bright, clean packing hall. Soft natural light, tidy floor, one Overtop-red container door visible far behind. Faces partly turned away, no text, no labels.

**Product D: macro detail.**

> Macro close-up of the winding of a copper wire rod coil: tight parallel strands of bright salmon-copper metal catching soft window light, shallow depth of field, clean neutral grey background blur. No text, no labels.

---

### Tips

- If the generator invents fake text on trucks or containers, add: "blank container doors, plain panels, no lettering".
- If the red looks orange or pink, add: "red exactly #DC0023, crimson-red, not orange".
- If the copper looks red or gold, add: "natural bright copper, salmon-orange, not red, not yellow gold".
- If the scene looks messy or old, add: "brand new, freshly built, immaculate".
- Keep only images that pass as real photographs. For the logo on trucks, place the real logo in an editor afterwards rather than trusting the generator to draw it.
