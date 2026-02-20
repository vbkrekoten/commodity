export type Locale = 'ru' | 'en';

const dictionaries = {
  ru: {
    appName: 'Сайт Товарной биржи',
    emptyState: 'Пока нет данных',
    cta: 'Перейти в кабинет',
  },
  en: {
    appName: 'Commodity Exchange Site',
    emptyState: 'No data yet',
    cta: 'Open cabinet',
  },
} as const;

export function t(locale: Locale, key: keyof (typeof dictionaries)['ru']): string {
  return dictionaries[locale]?.[key] ?? dictionaries.ru[key];
}
