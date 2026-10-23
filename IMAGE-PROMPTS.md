# Overtop: AI image prompts

Six photos for the website. Each one replaces a red-triangle placeholder panel. Direction: modern, clean, orderly, forward-looking Egyptian logistics, shot like editorial architectural photography.

## How to use

1. In your image generator (Midjourney, Nano Banana / Gemini, GPT-Image, Flux), attach the reference images from `D:\Overtop\ref images\` (`overtop-logo.png`, `overtop-mark.png`). Add real photos of your trucks, office or port to the same folder and attach those too: the closer to reality, the less "AI" the result looks.
2. Paste the **Style block** first, then the prompt for the image, then the **Negative prompt** (or its equivalent "avoid" field).
3. Save as **.webp** (or .jpg), at least the size listed, into `website/public/images/` with the file name shown.
4. In `website/src/content/images.ts`, set the path, e.g. `hero: '/images/hero.webp'`.

The site displays every photo cropped to fill its frame (`object-cover`), with a caption bar along the bottom edge. Keep the key subject away from the bottom 10% and leave calm space around it. Focus points set in `images.ts`: hero 50% 55%, import 58% 50%, export 72% 50%, transport 50% 50%, customs 68% 50%, about 62% 50%.

---

## Style block (paste before every prompt)

> Editorial architectural photograph of modern, contemporary Egyptian logistics, shot on a full-frame camera with a 35mm tilt-shift lens, perfectly level verticals, crisp natural daylight or clean blue hour. Forward-looking Alexandria and Egypt: modernised port terminals, wide clean quays, new highways and logistics zones, with subtle solar panels or wind turbines far in the background where it fits. Everything is new, orderly, spotless and well lit. Restrained palette of white, light grey, concrete and glass, with exactly one accent of signal red (#DC0023) as a solid block: an Overtop-red container, truck cab or stripe. Generous negative space, calm symmetrical composition. People wear clean professional workwear and PPE (white hard hats, hi-vis vests, tidy uniforms), candid and natural, never posing. Photorealistic, natural skin and material textures, sharp focus, not CGI, not a render. Blank container doors and plain truck panels, no text, no letters or numbers, no logos, no signage, no watermarks.

## Negative prompt

> dirt, grime, rust, dust, haze, smog, litter, puddles, peeling paint, graffiti, oil stains, clutter, chaos, crowds, crowded old streets, gritty look, desaturated documentary look, CGI, 3D render, sci-fi, futuristic neon, HDR, lens flare, fisheye, text, lettering, logos, signage, watermark, orange or pink red, more than one red object

---

## 1. Hero: `hero.webp`: 2400 × 1000 (wide, 12:5)

> Wide, low-angle shot of a modern automated container terminal at Alexandria port on a bright, clean morning. Wide pale-grey concrete apron with crisp lane markings in the foreground, plenty of empty space. A new Overtop-red truck cab pulling a single red 40 ft container drives out of the gate toward the camera, slightly left of centre. Behind it, neatly stacked containers in white, grey and pale blue, and sleek ship-to-shore gantry cranes under a clear sky. One worker in a clean grey hi-vis vest and white hard hat beside the gate. Horizon in the upper third, solar panels on a distant warehouse roof.

## 2. Import: `import.webp`: 1600 × 1200 (4:3)

> A container lifted off a large container ship by a modern ship-to-shore gantry crane, seen from a wide, spotless quay in clean daylight. The container hanging mid-air is Overtop red; every other container is white, grey or pale blue, perfectly stacked. Two port workers in white hard helmets and hi-vis vests stand at a safe distance, one holding a tablet. Clear blue sky, dry pale concrete quay, calm composition with open space on the left.

## 3. Export: `export.webp`: 1600 × 1200 (4:3)

> Interior of a new, bright logistics warehouse in a modern Egyptian industrial zone. White-wrapped pallets are loaded by a clean electric forklift into an open 40 ft container backed to a dock door, on a truck with an Overtop-red cab. Polished light-grey floor, high white walls, long skylights flooding the space with soft daylight, racking in neat rows. Workers in clean uniforms and hard hats. Tidy, symmetrical, lots of negative space, subject placed right of centre.

## 4. Transportation: `transport.webp`: 1600 × 1200 (4:3)

> Blue hour on a new multi-lane highway between Alexandria and Cairo. A modern Overtop-red truck cab pulling a light-grey container, seen three-quarter from the front, headlights on, on smooth dark asphalt with crisp white lines and clean barriers. A row of solar panels and slim lighting masts along the horizon under a clear deep-blue to pale-peach sky. Truck sharp, minimal and calm, wide empty road around it.

## 5. Customs Services: `customs.webp`: 1600 × 1200 (4:3)

> Customs inspection at a modern port logistics hall. A container stands open on a clean, brightly lit inspection bay with glass-and-steel architecture behind. An inspector and an Overtop agent in a tidy dark jacket with a small red triangle badge check cartons against a tablet. Chest-height documentary framing: hands, tablet and neatly aligned cartons in focus, faces partly turned away. Soft white daylight, pale polished concrete floor, restrained greys, uncluttered.

## 6. About Us: `about.webp`: 1600 × 1200 (4:3)

> A contemporary glass-and-steel office in Alexandria. A clean white desk with a laptop, a tablet, a phone and a tidy stack of documents. Floor-to-ceiling window behind, with a sharp view of the modern port, gantry cranes and a red container on the quay. One professional on a call, seen from the side, in a crisp white shirt. Bright natural light, white and light-grey interior, one small red accent object on the desk, generous empty space on the left.

---

### Tips

- If the generator invents fake text on trucks or containers, add: "blank container doors, plain panels, no lettering".
- If the red looks orange or pink, add: "red exactly #DC0023, crimson-red, not orange".
- If the scene looks messy or old, add: "brand new, freshly built, immaculate".
- Keep only images that pass as real photographs. For the logo on trucks, place the real logo in an editor afterwards rather than trusting the generator to draw it.
