export interface ThemeColors {
  bg: string;
  card: string;
  text: string;
  textMuted: string;
  accent: string;
  work: string;
  rest: string;
  other: string;
  ringTrack: string;
  border: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export const THEMES: Theme[] = [
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      bg: '#1a1a2e',
      card: '#16213e',
      text: '#eaeaea',
      textMuted: '#8b8b9a',
      accent: '#e94560',
      work: '#e94560',
      rest: '#4ade80',
      other: '#60a5fa',
      ringTrack: '#2a2a4a',
      border: '#2a2a4a',
    },
  },
  {
    id: 'light',
    name: 'Light',
    colors: {
      bg: '#f5f5f5',
      card: '#ffffff',
      text: '#1a1a2e',
      textMuted: '#6b6b7b',
      accent: '#e94560',
      work: '#e94560',
      rest: '#4ade80',
      other: '#60a5fa',
      ringTrack: '#e0e0e0',
      border: '#e0e0e0',
    },
  },
  {
    id: 'solarized',
    name: 'Solarized',
    colors: {
      bg: '#002b36',
      card: '#073642',
      text: '#93a1a1',
      textMuted: '#586e75',
      accent: '#cb4b16',
      work: '#dc322f',
      rest: '#859900',
      other: '#268bd2',
      ringTrack: '#073642',
      border: '#073642',
    },
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin',
    colors: {
      bg: '#1e1e2e',
      card: '#313244',
      text: '#cdd6f4',
      textMuted: '#9399b2',
      accent: '#f38ba8',
      work: '#f38ba8',
      rest: '#a6e3a1',
      other: '#89b4fa',
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
      other: '#8be9fd',
      ringTrack: '#44475a',
      border: '#44475a',
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
      other: '#7aa2f7',
      ringTrack: '#414868',
      border: '#414868',
    },
  },
];

export type ThemeId = typeof THEMES[number]['id'];
