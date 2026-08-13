// Separate from lib/content.ts on purpose: that module also imports the 3.2MB content.json,
// and importing from the same module in a client component risks bundling both together.
// This file only ever imports the much smaller toc.json (~52KB), safe for client components.
import rawToc from '@/content/toc.json';
import type { Toc } from './types';

export const toc: Toc = rawToc as unknown as Toc;
