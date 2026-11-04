export type AppLanguage = 'tr' | 'en';

/** English when the device language is English. Turkish for Turkish and every other language. */
export function languageFromCode(languageCode: string | null | undefined): AppLanguage {
  const primary = languageCode?.toLowerCase().split(/[-_]/)[0] ?? '';
  if (primary === 'en') {
    return 'en';
  }
  return 'tr';
}
