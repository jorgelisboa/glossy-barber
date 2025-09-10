"use client";

import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { useEffect } from 'react';

interface I18nProviderProps {
  children: React.ReactNode;
}

// Initialize i18next only once
if (!i18next.isInitialized) {
  i18next
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      fallbackLng: 'pt-BR',
      lng: typeof window !== 'undefined' ? navigator.language : 'pt-BR',
      ns: ['common'],
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      interpolation: {
        escapeValue: false,
      },
    });
}

export default function I18nProvider({ children }: I18nProviderProps) {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
