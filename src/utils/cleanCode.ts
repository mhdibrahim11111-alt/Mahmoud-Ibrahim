/**
 * Strips invisible Unicode Bidirectional isolate markers and private use glyphs
 * that cause code lines to reverse or garble when mixed with Arabic text.
 */
export function cleanCodeString(raw: string): string {
  if (!raw) return '';
  return raw
    // Remove Unicode BiDi control characters: LRM, RLM, LRE, RLE, PDF, LRO, RLO, LRI, RLI, FSI, PDI
    .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
    // Remove Google Docs / editor private use glyphs: , , etc.
    .replace(/[\uE000-\uF8FF]/g, '')
    .trim();
}
