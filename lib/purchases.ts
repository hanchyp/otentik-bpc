'use client';
import { useSyncExternalStore } from 'react';
import { getWork, quote } from './data';
import { isTier, type Purchase, type Tier } from './types';
const KEY = 'otentik-demo-v1';
const empty: Purchase[] = [];
let items = empty;
let initialized = false;
export let storageAvailable = true;
const listeners = new Set<() => void>();
export function validatePurchases(raw: unknown): Purchase[] {
  if (!Array.isArray(raw)) return [];
  const ids = new Set<string>();
  return raw.flatMap(x => {
    if (!x || typeof x.id !== 'string' || !/^OTK-[a-f0-9-]+$/.test(x.id) || ids.has(x.id) || !getWork(x.workId) || !isTier(x.tier) || !Number.isFinite(Date.parse(x.date)) || x.amount !== quote(x.workId, x.tier).total) return [];
    ids.add(x.id);
    return [{id: x.id, workId: x.workId, tier: x.tier, amount: x.amount, date: x.date, buyer: 'Pembeli demo'}];
  });
}
function read() {
  try { items = validatePurchases(JSON.parse(localStorage.getItem(KEY) || '[]')); storageAvailable = true; }
  catch { items = empty; storageAvailable = false; }
  initialized = true;
}
function snapshot() { if (!initialized && typeof window !== 'undefined') read(); return items; }
function changed() { listeners.forEach(fn => fn()); }
function onStorage(event: StorageEvent) { if (event.key === KEY || event.key === null) { read(); changed(); } }
function subscribe(fn: () => void) {
  if (!listeners.size) window.addEventListener('storage', onStorage);
  listeners.add(fn);
  return () => { listeners.delete(fn); if (!listeners.size) window.removeEventListener('storage', onStorage); };
}
export function usePurchases() { return useSyncExternalStore(subscribe, snapshot, () => empty); }
const noopSubscribe = () => () => {};
export function useHydrated() { return useSyncExternalStore(noopSubscribe, () => true, () => false); }
export function purchase(workId: string, tier: Tier) {
  const q = quote(workId, tier);
  snapshot();
  const existing = items.find(x => x.workId === workId && x.tier === tier);
  if (existing) return existing;
  const item: Purchase = {id: 'OTK-' + crypto.randomUUID(), workId, tier, date: new Date().toISOString(), amount: q.total, buyer: 'Pembeli demo'};
  items = [item, ...items];
  try { localStorage.setItem(KEY, JSON.stringify(items)); storageAvailable = true; } catch { storageAvailable = false; }
  changed(); return item;
}
export function resetPurchases() {
  items = empty; initialized = true;
  try { localStorage.removeItem(KEY); } catch { storageAvailable = false; }
  changed();
}
