export type Kind = 'campus' | 'nysc';

/** One generated portrait. Produced by scripts/build_media.py. */
export interface Shot {
  id: string;
  kind: Kind;
  /** Prompt number in LOOK-LIBRARY.md / NYSC-PROMPTS.md, for tracing back. */
  no: number | null;
  title: string;
}
