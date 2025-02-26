import { ui } from '../i18n/ui';
import { defaultLanguage, languages } from '../i18n/languages';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLanguage;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLanguage]) {
    return ui[lang][key] || ui[defaultLanguage][key];
  };
}

export function getRouteFromUrl(url: URL, lang: string): string {
  const path = url.pathname.split('/').slice(2).join('/');
  return '/' + lang + (path ? '/' + path : '');
} 