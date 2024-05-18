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

export function i18nSelectMapGenerator<T>(
  list: Array<T>,
  valueKey: keyof T,
  labelKey: keyof T
): {
  [key: string]: string;
} {
  return list.reduce<{ [key: string]: string }>((map, item) => {
    const value = item[valueKey] as unknown as boolean | number | string;
    const label = item[labelKey] as unknown as string;

    map[`${value}`] = label;

    return map;
  }, {});
}
