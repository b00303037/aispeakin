import { environment } from '../../../environments/environment';

export const tokenGetter: () => string | null = () =>
  localStorage.getItem(environment.tokenKey);

export function onThemeChange(): void {
  const darkFlag =
    localStorage['theme'] === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  document.documentElement.classList[darkFlag ? 'add' : 'remove']('dark');
}
