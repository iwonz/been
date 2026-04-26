# Been

Интерактивная карта поездок на Vite + React + TypeScript с использованием Yandex Maps JavaScript API.

Проект показывает посещенные страны, регионы и точки на карте: города, места, кафе, прыжки и аэропорты. Для некоторых точек есть балуны со ссылками на связанные посты или истории.

## Стек

- Vite
- React
- TypeScript
- Yandex Maps JavaScript API
- Yarn Classic

## Запуск

Установить зависимости:

```sh
yarn
```

Запустить dev server:

```sh
yarn dev
```

Собрать production-версию:

```sh
yarn build
```

Открыть production-сборку локально:

```sh
yarn preview
```

## Основные команды

- `yarn dev` - локальная разработка.
- `yarn build` - TypeScript build и Vite production build.
- `yarn preview` - preview production-сборки.
- `yarn lint` - ESLint с `--fix`, команда может менять файлы.
- `yarn format` - форматирование Prettier.
- `yarn deploy` - сборка и публикация `dist` в GitHub Pages.

## Структура проекта

- `src/main.tsx` - загружает Yandex Maps API и запускает React-приложение.
- `src/components/Map/Map.tsx` - основная логика карты: создание карты, маркеры, страны, регионы и hover-подсветка.
- `src/config.tsx` - настройки карты, цвета, статистика, иконки и содержимое балунов.
- `src/VISITED_LOCATIONS.ts` - единый агрегирующий экспорт `VISITED_LOCATIONS`.
- `src/VISITED_CITIES.ts`, `src/VISITED_PLACES.ts`, `src/VISITED_AIRPORTS.ts`, `src/VISITED_JUMPS.ts`, `src/VISITED_CAFES.ts` - отдельные списки точек по типам.
- `src/VISITED_REGIONS.ts` - список посещенных стран и регионов.
- `src/types.ts` - общие типы данных.
- `src/utils/downloadBorders.ts` - браузерные хелперы для скачивания свежих JSON с границами.
- `public/countries.json` - границы стран.
- `public/regions.json` - границы регионов для стран с детализацией.

Больше подробностей для будущих агентов и разработчиков есть в `AGENTS.md`.

## Данные

### Локации

Новые точки добавляются в подходящий файл рядом с `src/VISITED_LOCATIONS.ts`:

- `VISITED_CITIES.ts` - города.
- `VISITED_PLACES.ts` - места.
- `VISITED_AIRPORTS.ts` - аэропорты.
- `VISITED_JUMPS.ts` - прыжки.
- `VISITED_CAFES.ts` - кафе.

`src/VISITED_LOCATIONS.ts` оставляет единый экспорт для приложения и обычно не требует правок, если не появляется новый тип списка.

Минимальный пример:

```ts
{
  type: LocationType.CITY,
  name: 'Москва',
  coordinates: [55.755864, 37.617698],
}
```

Если у точки есть связанные события, можно добавить `actions`:

```ts
actions: [
  {
    name: 'Описание события',
    url: 'https://...',
  },
];
```

### Страны и регионы

Посещенные страны и регионы отмечаются в `src/VISITED_REGIONS.ts`:

```ts
export const VISITED_REGIONS: Record<string, boolean> = {
  RU: true,
  'RU-MOW': true,
};
```

Коды должны совпадать с кодами из данных Yandex Maps.

## Обновление границ

Границы стран и регионов лежат в `public/countries.json` и `public/regions.json`. Чтобы скачать свежие данные из Yandex Maps:

1. Запустить приложение через `yarn dev`.
2. Открыть страницу в браузере.
3. В консоли браузера выполнить:

```js
window.downloadBorders();
```

4. Заменить скачанными файлами `public/countries.json` и/или `public/regions.json`.

Размер этих JSON напрямую влияет на скорость старта приложения.

## Деплой

Проект настроен для GitHub Pages по пути `/been/`.

Важные места:

- `homepage` в `package.json`
- `base: '/been/'` в `vite.config.ts`
- загрузка JSON через `import.meta.env.BASE_URL` в `Map.tsx`

Для публикации:

```sh
yarn deploy
```
