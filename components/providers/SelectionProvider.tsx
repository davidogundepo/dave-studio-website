'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'dave-studio-selection';

interface Ctx {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  /** Set when a tile is tapped, so the badge can pulse without re-rendering the grid. */
  lastAdded: string | null;
}

const SelectionContext = createContext<Ctx | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore on mount. Wrapped because private-mode browsers throw on access.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      /* no stored selection is a fine starting state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* selection still works for this session without persistence */
    }
  }, [ids, hydrated]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      setLastAdded(id);
      return [...prev, id];
    });
  }, []);

  const remove = useCallback((id: string) => setIds((p) => p.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const value = useMemo<Ctx>(
    () => ({ ids, count: ids.length, has, toggle, remove, clear, open, setOpen, lastAdded }),
    [ids, has, toggle, remove, clear, open, lastAdded],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used inside SelectionProvider');
  return ctx;
}
