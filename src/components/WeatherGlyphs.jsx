/*
 * Cut-paper weather glyphs — replace emoji in hydration/weather chips.
 * Same angular paper language as the plants.
 */

export const SunGlyph = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <polygon points="12,0 14,4 10,4" fill="#C49008" />
    <polygon points="12,24 14,20 10,20" fill="#C49008" />
    <polygon points="0,12 4,10 4,14" fill="#C49008" />
    <polygon points="24,12 20,10 20,14" fill="#C49008" />
    <polygon points="12,5 17,7 19,12 17,17 12,19 7,17 5,12 7,7" fill="#E0B52B" />
    <polygon points="12,5 17,7 15,13 9,11" fill="#C49008" opacity="0.5" />
  </svg>
);

export const RainGlyph = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <polygon points="5,10 9,4 16,3 21,8 20,13 4,13" fill="#6E93B4" />
    <polygon points="9,4 16,3 15,10 8,11" fill="#527177" opacity="0.45" />
    <polygon points="7,16 9,15 8,21" fill="#6E93B4" />
    <polygon points="13,16 15,15 14,22" fill="#6E93B4" />
    <polygon points="18,15 20,14 19,20" fill="#6E93B4" />
  </svg>
);

export const CactusGlyph = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <polygon points="10,22 10,4 14,3 14,22" fill="#C37608" />
    <polygon points="4,8 7,8 8,14 10,14 10,17 5,16" fill="#C37608" />
    <polygon points="20,6 17,6 16,12 14,12 14,15 19,14" fill="#C37608" />
    <polygon points="10,4 14,3 13,12 10,12" fill="#8F5510" opacity="0.5" />
  </svg>
);
