import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import ja from './locales/ja.json';

const resources = {
  en: { translation: en },
  ja: { translation: ja },
};

// ユーザーの言語設定を取得
const locales = Localization.getLocales();
const languageCode = locales[0]?.languageCode || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: languageCode,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
