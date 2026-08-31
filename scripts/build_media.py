"""
Build the web derivatives for the Dave Studio gallery.

The Magnific outputs are ~930MB of PNG at 896x1200. None of that can go near a
browser, so every image is reduced to four WebP derivatives:

    public/gallery/thumb/<id>.webp   320w  3:4   cart rows, dense grids
    public/gallery/card/<id>.webp    720w  3:4   gallery tiles
    public/gallery/wide/<id>.webp   1280w 16:9   hero strips and bento wides
    public/gallery/full/<id>.webp   1400w 3:4    lightbox

The 16:9 crop is taken from the upper part of the frame, not the centre — these
are portraits, and a centre crop cuts the face off. Writes lib/gallery.generated.ts.

Run:  python3 scripts/build_media.py [--force]
"""
import json, os, re, subprocess, sys
from concurrent.futures import ProcessPoolExecutor

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT    = os.path.join(ROOT, "public", "gallery")
FORCE  = "--force" in sys.argv

# width, aspect ("3:4" keeps the frame, "16:9" crops a band), quality
SIZES = {
    "thumb": (320,  "3:4",  72),
    "card":  (720,  "3:4",  78),
    "wide":  (1280, "16:9", 80),
    "full":  (1400, "3:4",  82),
}
# where the 16:9 band sits vertically: 0 = top, 1 = bottom. Faces sit high in
# a 3:4 portrait, so the band is pulled well above centre.
WIDE_FOCUS = 0.34


def derive(args):
    src, ident = args
    made = []
    for kind, (w, aspect, q) in SIZES.items():
        dst = os.path.join(OUT, kind, f"{ident}.webp")
        if os.path.exists(dst) and not FORCE:
            continue
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if aspect == "3:4":
            h = round(w * 4 / 3)
            chain = ["-resize", f"{w}x{h}^", "-gravity", "north", "-extent", f"{w}x{h}"]
        else:
            h = round(w * 9 / 16)
            # scale to width, then cut a 16:9 band with its centre at WIDE_FOCUS
            chain = ["-resize", f"{w}x", "-gravity", "north",
                     "-crop", f"{w}x{h}+0+%[fx:max(0,int(h*{WIDE_FOCUS})-{h}/2)]", "+repage"]
        try:
            subprocess.run(["magick", src, "-auto-orient", *chain,
                            "-quality", str(q), "-define", "webp:method=4", dst],
                           check=True, capture_output=True)
            made.append(kind)
        except subprocess.CalledProcessError as e:
            return (ident, f"FAIL {kind}: {e.stderr[:120]!r}")
    return (ident, f"ok {len(made)}")


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    inv    = json.load(open(os.path.join(here, "inventory.json")))
    titles = json.load(open(os.path.join(here, "titles.json")))

    # Sources are renamed to catalogue numbers (campus-047.png), so the prompt
    # number is recovered through each folder's RENAME-UNDO.json rather than
    # from the filename in front of us.
    original = {}
    for d in {os.path.dirname(r["path"]) for r in inv.values()}:
        u = os.path.join(d, "RENAME-UNDO.json")
        if os.path.exists(u):
            original.update(json.load(open(u)))

    def promptno(name):
        name = original.get(name, name)
        m = re.match(r"magnific_(\d+)", name)
        if m: return int(m.group(1))
        m = re.match(r"^(\d{2,3})\.", name)
        return int(m.group(1)) if m else None

    def catalogue(name):
        """The number the studio opens the file by: campus-047.png -> 47."""
        m = re.match(r"(?:campus|nysc)-(\d+)", name)
        return int(m.group(1)) if m else None

    # David hand-picked the public-facing set from all 529, one by one. Those
    # lead every surface — hero, marquee, bento, share card, and the top of both
    # galleries — because an index-stride pick will happily surface a shot with a
    # displaced arm. Everything else still ships, just behind them.
    featured_path = os.path.join(here, "featured.txt")
    featured_rank = {}
    if os.path.exists(featured_path):
        wanted = [l.strip() for l in open(featured_path)
                  if l.strip() and not l.startswith("#")]
        stems = {}
        for r in inv.values():
            stems[os.path.splitext(r["name"])[0]] = r["name"]
            orig = original.get(r["name"])
            if orig:
                stems[os.path.splitext(orig)[0]] = r["name"]
        for rank, w in enumerate(wanted):
            key = w
            if key not in stems and re.fullmatch(r"\d{2,3}", w):
                key = f"{int(w):03d}"                     # bare 070 style entries
            if key not in stems:                          # tolerate a truncated paste
                near = [s for s in stems if s.startswith(w)]
                key = near[0] if len(near) == 1 else None
            if key is None:
                print(f"  WARN  featured entry not found: {w}")
                continue
            featured_rank[stems[key]] = rank

    rows = []
    for h, r in inv.items():
        rows.append({**r, "hash": h, "no": promptno(r["name"])})
    # stable order: prompt number, then filename
    rows.sort(key=lambda r: (r["kind"], r["no"] if r["no"] is not None else 9999, r["name"]))

    # The id is derived from the image's own content hash, never from its
    # position. Positional ids (c001, c002, …) renumber every shot after any
    # deletion, which silently rewrites a customer's saved selection into
    # different photographs and sends the studio an order nobody placed.
    # A content id is stable for the life of the image.
    items, jobs = [], []
    seen_ids = {}
    for r in rows:
        ident = f"{'c' if r['kind']=='campus' else 'n'}{r['hash'][:7]}"
        if ident in seen_ids:                      # 7 hex chars, but be certain
            ident = f"{ident}{r['hash'][7:9]}"
        seen_ids[ident] = r["name"]
        title = titles[r["kind"]].get(str(r["no"])) if r["no"] is not None else None
        items.append({
            "id": ident, "kind": r["kind"], "no": r["no"],
            "title": title or "Studio portrait", "file": r["name"],
            "feat": featured_rank.get(r["name"]),
            "ref": catalogue(r["name"]),
            "file": r["name"],
        })
        jobs.append((r["path"], ident))

    print(f"{len(jobs)} images -> {len(SIZES)} derivatives each")
    done = 0
    with ProcessPoolExecutor(max_workers=os.cpu_count() or 4) as ex:
        for ident, status in ex.map(derive, jobs, chunksize=4):
            done += 1
            if status.startswith("FAIL"): print(" ", ident, status, flush=True)
            if done % 50 == 0: print(f"  {done}/{len(jobs)}", flush=True)

    ts = json.dumps
    lines = ["// AUTO-GENERATED by scripts/build_media.py — do not edit by hand.", "",
             "import type { Shot } from './types';", "",
             "export const shots: Shot[] = ["]
    for it in items:
        lines.append("  { id: %s, kind: %s, no: %s, ref: %s, feat: %s, title: %s }," % (
            ts(it["id"]), ts(it["kind"]),
            it["no"] if it["no"] is not None else "null",
            it["ref"] if it["ref"] is not None else "null",
            it["feat"] if it["feat"] is not None else "null",
            ts(it["title"], ensure_ascii=False)))
    lines += ["];", ""]
    open(os.path.join(ROOT, "lib", "gallery.generated.ts"), "w").write("\n".join(lines))
    print(f"  featured: {sum(1 for i in items if i['feat'] is not None)} hand-picked")
    assert len(seen_ids) == len(items), "id collision — widen the hash slice"
    print(f"wrote lib/gallery.generated.ts — {len(items)} shots "
          f"({sum(1 for i in items if i['kind']=='campus')} campus, "
          f"{sum(1 for i in items if i['kind']=='nysc')} nysc)")

    # Derivatives whose shot no longer exists would otherwise keep being served:
    # the build only ever adds, so a deleted source leaves its images behind.
    live = {i["id"] for i in items}
    stale = 0
    for kind in SIZES:
        d = os.path.join(OUT, kind)
        if not os.path.isdir(d):
            continue
        for f in os.listdir(d):
            if os.path.splitext(f)[0] not in live:
                os.remove(os.path.join(d, f)); stale += 1
    if stale:
        print(f"  pruned {stale} derivatives whose source image is gone")


if __name__ == "__main__":
    main()
