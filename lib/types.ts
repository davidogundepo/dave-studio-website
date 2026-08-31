export type Kind = 'campus' | 'nysc';

/** One generated portrait. Produced by scripts/build_media.py. */
export interface Shot {
  id: string;
  kind: Kind;
  /** Prompt number in LOOK-LIBRARY.md / NYSC-PROMPTS.md, for tracing back. */
  no: number | null;
  /** Rank in David's hand-picked set, or null if it is not one of them. */
  feat: number | null;
  /** Catalogue number — the file is campus-<ref>.png / nysc-<ref>.png. */
  ref: number | null;
  title: string;
}
