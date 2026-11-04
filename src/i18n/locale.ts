import { getLocales } from 'expo-localization';

import { loadSavedLanguage } from '../storage/language';
import { languageFromCode } from './language';
import type { AppLanguage } from './language';

/** Saved choice wins. The device language is only the fallback before that choice. */
export function resolveLanguage(): AppLanguage {
  const saved = loadSavedLanguage();
  if (saved) {
    return saved;
  }
  const [primary] = getLocales();
  return languageFromCode(primary?.languageCode ?? primary?.languageTag);
}
