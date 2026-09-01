"""
Shared logic for matching David's hand-picked list (featured.txt, one original
magnific filename per line) against whatever the current filenames are.

Used by both build_media.py (to rank shots for the manifest) and
rename_sources.py (to number the featured set first on disk). One function so
the two never drift out of matching 121 the same way.
"""
import os
import re


def build_featured_rank(name_to_original: dict, quiet: bool = False) -> dict:
    """
    name_to_original: {current filename -> the true original magnific filename}.
    Returns {current filename -> rank in featured.txt}, 0-based, for every match.

    featured.txt covers BOTH galleries. Called once per folder, so an entry
    belonging to the other gallery is an expected miss here, not a real one —
    pass quiet=True to skip logging those.
    """
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "featured.txt")
    if not os.path.exists(path):
        return {}

    wanted = [l.strip() for l in open(path) if l.strip() and not l.startswith("#")]
    stems = {}
    for cur, orig in name_to_original.items():
        stems[os.path.splitext(orig)[0]] = cur

    rank = {}
    for i, w in enumerate(wanted):
        key = w
        if key not in stems and re.fullmatch(r"\d{2,3}", w):
            key = f"{int(w):03d}"                  # bare "070" style entries
        if key not in stems:
            near = [s for s in stems if s.startswith(w)]
            key = near[0] if len(near) == 1 else None  # tolerate a truncated paste
        if key is None:
            if not quiet:
                print(f"  WARN  featured entry not found: {w}")
            continue
        rank[stems[key]] = i
    return rank
