"""
Number every source image so David's hand-picked set leads — 001, 002, 003…
in the exact order he chose them — with the rest of the catalogue filling in
after. The gallery grid ALSO shows the hand-picked set first, so the number now
visible on a tile matches its position while scrolling, for every shot that
was actually curated.

Safe to re-run: it always reorders from the true original filename (chained
through any existing RENAME-UNDO.json), never from the current campus-NNN /
nysc-NNN name, so running it twice in a row is a no-op and running it after
editing featured.txt reorders correctly rather than compounding.

Shot ids are derived from image CONTENT, not filename, so this never disturbs
the live site, saved selections, or cached derivatives — only the number shown.

Run:  python3 scripts/rename_sources.py
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from featured_match import build_featured_rank

BASE = "/Users/user/Documents/studio projects/Dave Studio/Personalities & Assets"
FOLDERS = {
    "campus": f"{BASE}/campus/magnific output-campus",
    "nysc":   f"{BASE}/nysc/magnific-output-nysc",
}
IMG = (".png", ".jpg", ".jpeg", ".webp")


def promptno(name):
    m = re.match(r"magnific_(\d+)", name)
    if m: return int(m.group(1))
    m = re.match(r"^(\d{2,3})\.", name)
    return int(m.group(1)) if m else None


def main():
    for kind, d in FOLDERS.items():
        files = sorted(f for f in os.listdir(d)
                       if os.path.isfile(os.path.join(d, f)) and f.lower().endswith(IMG))

        undo_path = os.path.join(d, "RENAME-UNDO.json")
        # current filename -> the TRUE original, even if this folder has been
        # renamed before. A first-ever run has no undo file, so a file is its
        # own original.
        original = json.load(open(undo_path)) if os.path.exists(undo_path) else {}
        original = {f: original.get(f, f) for f in files}

        featured = build_featured_rank(original, quiet=True)
        print(f"{kind}: {len(featured)} of {len(files)} matched to featured.txt")

        def sort_key(f):
            orig = original[f]
            feat = featured.get(f)
            no = promptno(orig)
            # featured first (in their given order), then by prompt number,
            # then by original filename for a stable tie-break
            return (0 if feat is not None else 1,
                    feat if feat is not None else 0,
                    no if no is not None else 9999,
                    orig)

        files.sort(key=sort_key)

        # two phases so a numeric target can't collide with an existing one
        staged = []
        for i, f in enumerate(files, 1):
            ext = os.path.splitext(f)[1].lower()
            tmp = f"__tmp_{i:04d}{ext}"
            os.rename(os.path.join(d, f), os.path.join(d, tmp))
            staged.append((tmp, original[f]))

        new_undo = {}
        for i, (tmp, orig) in enumerate(staged, 1):
            ext = os.path.splitext(tmp)[1].lower()
            final = f"{kind}-{i:03d}{ext}"
            os.rename(os.path.join(d, tmp), os.path.join(d, final))
            new_undo[final] = orig

        json.dump(new_undo, open(undo_path, "w"), indent=1)
        print(f"{kind}: renumbered {len(files)} files, hand-picked set leads "
              f"-> {kind}-001 … {kind}-{len(files):03d}")


if __name__ == "__main__":
    main()
