import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';
import ja from './locales/ja.json';
import de from './locales/de.json';

const fallbackLng = 'en';
const deviceLng = getLocales()[0]?.languageCode ?? fallbackLng;

export const supportedLanguages = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'de', label: 'Deutsch' },
] as const;

export type SupportedLanguageCode = (typeof supportedLanguages)[number]['code'];

export const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
    de: { translation: de },
  },
  lng: deviceLng,
  fallbackLng,
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});
