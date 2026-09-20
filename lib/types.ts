import { works, tiers } from './data';
export type Work = typeof works[number];
export type Tier = keyof typeof tiers;
export type Purchase = { id: string; workId: string; tier: Tier; amount: number; date: string; buyer: string; seed?: boolean };
export function isTier(value: unknown): value is Tier { return typeof value === 'string' && Object.hasOwn(tiers, value); }
