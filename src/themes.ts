export interface ThemeColors {
  bg: string;
  card: string;
  text: string;
  textMuted: string;
  accent: string;
  work: string;
  rest: string;
  ringTrack: string;
  border: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export const THEMES: Theme[] = [
  // Dark themes
  {
    id: 'dark',
    name: 'Dark (Default)',
    colors: {
      bg: '#1a1a2e',
      card: '#16213e',
      text: '#eaeaea',
      textMuted: '#8b8b9a',
      accent: '#e94560',
      work: '#e94560',
      rest: '#4ade80',
      ringTrack: '#2a2a4a',
      border: '#2a2a4a',
    },
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin (Mocha)',
    colors: {
      bg: '#1e1e2e',
      card: '#313244',
      text: '#cdd6f4',
      textMuted: '#9399b2',
      accent: '#f38ba8',
      work: '#f38ba8',
      rest: '#a6e3a1',
      ringTrack: '#45475a',
      border: '#45475a',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    colors: {
      bg: '#282a36',
      card: '#383a59',
      text: '#f8f8f2',
      textMuted: '#6272a4',
      accent: '#bd93f9',
      work: '#ff5555',
      rest: '#50fa7b',
      ringTrack: '#44475a',
      border: '#44475a',
    },
  },
  {
    id: 'everforest-dark',
    name: 'Everforest (Dark)',
    colors: {
      bg: '#2b3339',
      card: '#374145',
      text: '#d3c6aa',
      textMuted: '#859289',
      accent: '#a7c080',
      work: '#e67e80',
      rest: '#a7c080',
      ringTrack: '#323c41',
      border: '#323c41',
    },
  },
  {
    id: 'gruvbox-dark',
    name: 'Gruvbox (Dark)',
    colors: {
      bg: '#282828',
      card: '#3c3836',
      text: '#ebdbb2',
      textMuted: '#928374',
      accent: '#fabd2f',
      work: '#fb4934',
      rest: '#b8bb26',
      ringTrack: '#1d2021',
      border: '#1d2021',
    },
  },
  {
    id: 'kanagawa',
    name: 'Kanagawa',
    colors: {
      bg: '#1f1f28',
      card: '#2a2a37',
      text: '#dcd7ba',
      textMuted: '#938aa9',
      accent: '#d8a657',
      work: '#ea6962',
      rest: '#a9b665',
      ringTrack: '#3c3836',
      border: '#3c3836',
    },
  },
  {
    id: 'nightfox',
    name: 'Nightfox',
    colors: {
      bg: '#0d1821',
      card: '#142132',
      text: '#d6d6d4',
      textMuted: '#8b9bb4',
      accent: '#f4b8e4',
      work: '#c94d56',
      rest: '#8eb573',
      ringTrack: '#0b1324',
      border: '#0b1324',
    },
  },
  {
    id: 'rose-pine',
    name: 'Rose Pine',
    colors: {
      bg: '#191724',
      card: '#26233a',
      text: '#e0def4',
      textMuted: '#908caa',
      accent: '#ebbcba',
      work: '#eb6f92',
      rest: '#9ccfd8',
      ringTrack: '#1f1d2e',
      border: '#1f1d2e',
    },
  },
  {
    id: 'solarized-dark',
    name: 'Solarized (Dark)',
    colors: {
      bg: '#002b36',
      card: '#073642',
      text: '#93a1a1',
      textMuted: '#586e75',
      accent: '#cb4b16',
      work: '#dc322f',
      rest: '#859900',
      ringTrack: '#073642',
      border: '#073642',
    },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    colors: {
      bg: '#1a1b26',
      card: '#24283b',
      text: '#a9b1d6',
      textMuted: '#565f89',
      accent: '#7aa2f7',
      work: '#f7768e',
      rest: '#9ece6a',
      ringTrack: '#414868',
      border: '#414868',
    },
  },
  // Light themes
  {
    id: 'light',
    name: 'Light (Default)',
    colors: {
      bg: '#f5f5f5',
      card: '#ffffff',
      text: '#1a1a2e',
      textMuted: '#6b6b7b',
      accent: '#e94560',
      work: '#e94560',
      rest: '#4ade80',
      ringTrack: '#e0e0e0',
      border: '#e0e0e0',
    },
  },
  {
    id: 'catppuccin-latte',
    name: 'Catppuccin (Latte)',
    colors: {
      bg: '#eff1f5',
      card: '#e6e9ef',
      text: '#4c4f69',
      textMuted: '#6c6f85',
      accent: '#ea76cb',
      work: '#d20f39',
      rest: '#40a02b',
      ringTrack: '#ccd0da',
      border: '#ccd0da',
    },
  },
  {
    id: 'everforest-light',
    name: 'Everforest (Light)',
    colors: {
      bg: '#faf3e0',
      card: '#f0ebda',
      text: '#5c6a72',
      textMuted: '#93998e',
      accent: '#8da101',
      work: '#e67e80',
      rest: '#8da101',
      ringTrack: '#e5e0d8',
      border: '#e5e0d8',
    },
  },
  {
    id: 'gruvbox-light',
    name: 'Gruvbox (Light)',
    colors: {
      bg: '#fbf1c7',
      card: '#f2e5bc',
      text: '#3c3836',
      textMuted: '#665c54',
      accent: '#b57614',
      work: '#9d0006',
      rest: '#79740e',
      ringTrack: '#ebdbb2',
      border: '#ebdbb2',
    },
  },
  {
    id: 'solarized-light',
    name: 'Solarized (Light)',
    colors: {
      bg: '#fdf6e3',
      card: '#eee8d5',
      text: '#657b83',
      textMuted: '#93a1a1',
      accent: '#cb4b16',
      work: '#dc322f',
      rest: '#859900',
      ringTrack: '#eee8d5',
      border: '#eee8d5',
    },
  },
  {
    id: 'rose-pine-dawn',
    name: 'Rose Pine Dawn',
    colors: {
      bg: '#faf4ed',
      card: '#fffaf3',
      text: '#575279',
      textMuted: '#9893a5',
      accent: '#d7827e',
      work: '#b4637e',
      rest: '#56949f',
      ringTrack: '#f2e9e1',
      border: '#f2e9e1',
    },
  },
  {
    id: 'dayfox',
    name: 'Dayfox',
    colors: {
      bg: '#f6f2ee',
      card: '#e8e1dc',
      text: '#2d2a2e',
      textMuted: '#8a8488',
      accent: '#f4b8e4',
      work: '#c94d56',
      rest: '#8eb573',
      ringTrack: '#d8d0cc',
      border: '#d8d0cc',
    },
  },
  {
    id: 'tokyo-day',
    name: 'Tokyo Day',
    colors: {
      bg: '#f5f5f5',
      card: '#e1e2e7',
      text: '#343b58',
      textMuted: '#535978',
      accent: '#52799b',
      work: '#c94d56',
      rest: '#7aa2f7',
      ringTrack: '#d1d5db',
      border: '#d1d5db',
    },
  },
  {
    id: 'kanagawa-wave',
    name: 'Kanagawa Wave',
    colors: {
      bg: '#f3ebe0',
      card: '#eaddcf',
      text: '#363646',
      textMuted: '#6e6e84',
      accent: '#d8a657',
      work: '#e46876',
      rest: '#87a856',
      ringTrack: '#d8ccc0',
      border: '#d8ccc0',
    },
  },
  {
    id: 'dracula-light',
    name: 'Dracula (Soft)',
    colors: {
      bg: '#f8f8f2',
      card: '#e8e8e2',
      text: '#282a36',
      textMuted: '#6272a4',
      accent: '#bd93f9',
      work: '#ff5555',
      rest: '#50fa7b',
      ringTrack: '#d8d8d2',
      border: '#d8d8d2',
    },
  },
];

export type ThemeId = typeof THEMES[number]['id'];
