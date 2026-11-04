import type { AppLanguage } from './language';

const copy = {
  tr: {
    eggLabel: 'Yumurta',
  },
  en: {
    eggLabel: 'Egg',
  },
} as const;

export function stringsFor(language: AppLanguage) {
  return copy[language];
}
