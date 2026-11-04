import { getLocales } from 'expo-localization';

import { languageFromCode } from './language';
import type { AppLanguage } from './language';

export function resolveLanguage(): AppLanguage {
  const [primary] = getLocales();
  return languageFromCode(primary?.languageCode ?? primary?.languageTag);
}
