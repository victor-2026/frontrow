import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';

const fallbackLng = 'en';
const deviceLng = getLocales()[0]?.languageCode ?? fallbackLng;

export const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: deviceLng,
  fallbackLng,
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});
