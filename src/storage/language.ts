import { File, Paths } from 'expo-file-system';

import type { AppLanguage } from '../i18n/language';

const FILE_NAME = 'language.json';

function languageFile(): File {
  return new File(Paths.document, FILE_NAME);
}

export function loadSavedLanguage(): AppLanguage | null {
  const file = languageFile();
  if (!file.exists) {
    return null;
  }
  try {
    const parsed = JSON.parse(file.textSync()) as { language?: unknown };
    if (parsed.language === 'tr' || parsed.language === 'en') {
      return parsed.language;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveLanguage(language: AppLanguage) {
  const file = languageFile();
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.writeSync(JSON.stringify({ language }));
}
