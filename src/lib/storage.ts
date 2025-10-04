// Theme persistence utilities
export const THEME_KEY = 'applypro-theme';

export type Theme = 'light' | 'dark' | 'system';

export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem(THEME_KEY) as Theme) || 'system';
};

export const setStoredTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_KEY, theme);
};

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  if (theme === 'system') {
    const systemTheme = getSystemTheme();
    root.classList.toggle('dark', systemTheme === 'dark');
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
};