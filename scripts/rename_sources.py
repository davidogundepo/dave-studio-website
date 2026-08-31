"""
Give every source image a sequential catalogue number.

The studio fulfils orders by opening the original file. Magnific's own names
("magnific_70-tight-portrait-glasses_0eBngkXTfW.png") are unfindable by hand,
and the prompt number is ambiguous — 82 prompt numbers cover more than one
image. A catalogue number is unique and orderable:

    campus/magnific output-campus/campus-047.png
    nysc/magnific-output-nysc/nysc-112.png

Shot ids are derived from image CONTENT, not filename, so renaming does not
disturb the site, saved selections, or cached derivatives.

Each folder gets a RENAME-UNDO.json mapping the new name back to the original,
which is also how build_media.py recovers the prompt number for titles.

Run once:  python3 scripts/rename_sources.py [--dry-run]
"""
import json, os, re, sys

BASE = "/Users/user/Documents/studio projects/Dave Studio/Personalities & Assets"
FOLDERS = {
    "campus": f"{BASE}/campus/magnific output-campus",
    "nysc":   f"{BASE}/nysc/magnific-output-nysc",
}
IMG = (".png", ".jpg", ".jpeg", ".webp")
DRY = "--dry-run" in sys.argv


def promptno(name):
    m = re.match(r"magnific_(\d+)", name)
    if m: return int(m.group(1))
    m = re.match(r"^(\d{2,3})\.", name)
    return int(m.group(1)) if m else None


def main():
    for kind, d in FOLDERS.items():
        undo_path = os.path.join(d, "RENAME-UNDO.json")
        if os.path.exists(undo_path):
            print(f"{kind}: already renamed (RENAME-UNDO.json present) — skipping")
            continue

        files = sorted(f for f in os.listdir(d)
                       if os.path.isfile(os.path.join(d, f)) and f.lower().endswith(IMG))
        # same order the site uses: prompt number, then filename
        files.sort(key=lambda f: (promptno(f) if promptno(f) is not None else 9999, f))

        undo = {}
        # two phases: a numeric target can collide with an existing numeric name
        for i, f in enumerate(files, 1):
            ext = os.path.splitext(f)[1].lower()
            os.rename(os.path.join(d, f), os.path.join(d, f"__tmp_{i:04d}{ext}")) if not DRY else None
            undo[f"{kind}-{i:03d}{ext}"] = f
        for i, f in enumerate(files, 1):
            ext = os.path.splitext(f)[1].lower()
            if not DRY:
                os.rename(os.path.join(d, f"__tmp_{i:04d}{ext}"),
                          os.path.join(d, f"{kind}-{i:03d}{ext}"))

        if not DRY:
            json.dump(undo, open(undo_path, "w"), indent=1)
        print(f"{kind}: {'would rename' if DRY else 'renamed'} {len(files)} files "
              f"-> {kind}-001 … {kind}-{len(files):03d}")


if __name__ == "__main__":
    main()
