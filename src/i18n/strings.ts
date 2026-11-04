import type { AppLanguage } from './language';

const copy = {
  tr: {
    eggLabel: 'Yumurta',
    name: 'İsim',
    age: 'Yaş',
    gender: 'Cinsiyet',
    email: 'E-posta',
    woman: 'Kadın',
    man: 'Erkek',
    save: 'Kaydet',
    saving: 'Kaydediliyor',
    saved: 'Kaydedildi',
    missingFields: 'Tüm alanları doldur',
    saveFailed: 'Kayıt yazılamadı',
    admin: 'Yönetim',
    password: 'Parola',
    unlock: 'Aç',
    wrongPassword: 'Parola yanlış',
    records: 'Kayıtlar',
    emptyRecords: 'Kayıt yok',
    ip: 'IP',
    savedAt: 'Kayıt zamanı',
    back: 'Geri',
  },
  en: {
    eggLabel: 'Egg',
    name: 'Name',
    age: 'Age',
    gender: 'Gender',
    email: 'Email',
    woman: 'Woman',
    man: 'Man',
    save: 'Save',
    saving: 'Saving',
    saved: 'Saved',
    missingFields: 'Fill in every field',
    saveFailed: 'Could not save',
    admin: 'Admin',
    password: 'Password',
    unlock: 'Open',
    wrongPassword: 'Wrong password',
    records: 'Records',
    emptyRecords: 'No records',
    ip: 'IP',
    savedAt: 'Saved at',
    back: 'Back',
  },
} as const;

export function stringsFor(language: AppLanguage) {
  return copy[language];
}

export type AppCopy = ReturnType<typeof stringsFor>;
