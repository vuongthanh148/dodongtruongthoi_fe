export const THEMES = [
  {
    id: 'default',
    label: 'Default',
    description: 'Crimson red · Antique gold · Bronze (year-round)',
  },
  {
    id: 'tet',
    label: 'Lunar New Year',
    description: 'Bright scarlet · Vibrant amber gold · Festive',
  },
  {
    id: 'independence',
    label: 'Independence Day',
    description: 'Patriotic red · Antique gold · Sep 2',
  },
  {
    id: 'labor-day',
    label: 'Labor Day',
    description: 'Warm red · Amber gold · May 1',
  },
] as const

export type ThemeId = (typeof THEMES)[number]['id']
