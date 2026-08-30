# Dave Studio

Graduation and NYSC portraits generated around a customer's own photographs.
Static Next.js site, deployed to Firebase Hosting alongside Dave Architectures
and Dave Websites.

## The galleries

529 finished portraits — 339 campus, 190 NYSC — every one of them selectable.
A visitor taps looks until they hit a bundle, then the selection is handed to
WhatsApp as a numbered list David can fulfil from directly.

## Media pipeline

The Magnific output is ~930MB of 896×1200 PNG. None of it can go near a browser,
so `scripts/build_media.py` reduces every image to four WebP derivatives:

| Derivative | Width | Shape | Used by |
|---|---|---|---|
| `thumb` | 320 | 3:4 | hero wall, cart rows |
| `card` | 720 | 3:4 | gallery tiles |
| `wide` | 1280 | 16:9 | bento wides, CTA backdrop |
| `full` | 1400 | 3:4 | lightbox |

The 16:9 crop is taken from the upper third of the frame, not the centre —
these are portraits, and a centre crop decapitates them.

```bash
python3 scripts/build_media.py          # incremental
python3 scripts/build_media.py --force  # rebuild everything
```

It reads `scripts/inventory.json` (content-hashed, deduplicated) and
`scripts/titles.json` (look titles parsed from the prompt libraries), and writes
`lib/gallery.generated.ts`. 930MB in, 116MB out.

## Running it

```bash
npm install
npm run dev
npm run build      # static export to out/
```

## Deploying

```bash
firebase deploy --only hosting:dave-studio
```

## A note on motion

Entrance animations are driven by requestAnimationFrame, which browsers throttle
to a stop while a tab is hidden. A page opened in a background tab used to freeze
its intro part-way and strand the headline off-screen. `lib/motion.ts` defers
animation until the tab is actually visible, and nothing is hidden in CSS that
JavaScript is then responsible for bringing back — if the script never runs, the
page still reads.
