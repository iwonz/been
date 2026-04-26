# Путеводитель по проекту

## Что это за проект

`been` - это одностраничное приложение на Vite + React + TypeScript, которое показывает интерактивную карту поездок через Yandex Maps JavaScript API.

На карте отображаются:

- посещенные страны и отдельные регионы стран;
- маркеры городов, мест, кафе, прыжков и аэропортов;
- балуны маркеров со ссылками на связанные посты или истории;
- небольшой блок статистики: страны, населенные пункты, регионы России и аэропорты.

Приложение рассчитано на деплой в GitHub Pages по пути `/been/`, поэтому в `vite.config.ts` задано `base: '/been/'`.

## Основной сценарий запуска

1. `src/main.tsx` загружает скрипт Yandex Maps через `addScript`.
2. После загрузки скрипта React рендерит компонент `Map`.
3. `src/components/Map/Map.tsx` ждет `ymaps.ready`.
4. `initializeMap()` создает карту, контролы, маркеры, полигоны стран и полигоны регионов.
5. Границы загружаются из `public/countries.json` и `public/regions.json` через `import.meta.env.BASE_URL`, чтобы пути работали на GitHub Pages.

React здесь отвечает только за контейнер карты и блок статистики. Сама карта создается и наполняется императивно через `ymaps`.

## Главные файлы

- `index.html` - HTML-оболочка приложения: root-элемент, favicon, viewport/meta и Vite entry script.
- `vite.config.ts` - конфигурация Vite; `base: '/been/'` нужен для текущего деплоя в GitHub Pages.
- `src/main.tsx` - загружает Yandex Maps API, кладет `downloadBorders` в `window`, затем рендерит приложение.
- `src/components/Map/Map.tsx` - ядро карты: создание карты, контролы, маркеры, загрузка JSON с границами, отрисовка полигонов и hover-логика.
- `src/components/Map/Map.module.css` - полноэкранная раскладка карты и стили панели статистики.
- `src/config.tsx` - настройки приложения: язык, состояние и опции карты, цвета, страны с детализацией по регионам, особая обработка регионов, статистика, иконки маркеров и содержимое балунов.
- `src/VISITED_LOCATIONS.ts` - единый агрегирующий экспорт `VISITED_LOCATIONS`; импортирует списки из соседних `VISITED_*` файлов.
- `src/VISITED_CITIES.ts`, `src/VISITED_PLACES.ts`, `src/VISITED_AIRPORTS.ts`, `src/VISITED_JUMPS.ts`, `src/VISITED_CAFES.ts` - исходные данные для маркеров, разнесенные по типам.
- `src/VISITED_REGIONS.ts` - посещенные страны и регионы в виде объекта с ключами ISO-like кодов из данных Yandex Maps.
- `src/types.ts` - общие типы локаций и иконок.
- `src/utils/addScript.ts` - добавляет внешний `script` в документ и возвращает `Promise<HTMLScriptElement>`.
- `src/utils/download.ts` - создает клиентское скачивание файла из строки.
- `src/utils/downloadBorders.ts` - браузерные хелперы для скачивания свежих JSON с границами из Yandex Maps.
- `src/utils/isVisitedRegionOrCountry.ts` - простой lookup поверх `VISITED_REGIONS`.
- `global.d.ts` - объявляет глобальный `ymaps` как `any`.
- `public/countries.json` - заранее скачанные границы стран. Файл большой: около 15 MB raw.
- `public/regions.json` - заранее скачанные границы регионов для стран из конфига. Файл большой: около 8.7 MB raw.

## Модель данных

### Локации

Файлы `src/VISITED_CITIES.ts`, `src/VISITED_PLACES.ts`, `src/VISITED_AIRPORTS.ts`, `src/VISITED_JUMPS.ts` и `src/VISITED_CAFES.ts` содержат объекты такого вида:

```ts
{
  type: LocationType.CITY,
  name: 'Москва',
  coordinates: [55.755864, 37.617698],
  actions: [
    {
      name: 'Описание события',
      url: 'https://...',
    },
  ],
}
```

`coordinates` - координаты Yandex Maps в порядке `[latitude, longitude]`.

`actions` необязателен. Если массив есть и не пустой, `PLACES_CONFIG.getBalloonContent()` отрисует ссылки в балуне маркера. `getLocationIcon()` сейчас сначала проверяет тип локации с отдельной иконкой, а уже потом использует action-иконку для остальных локаций с событиями.

### Регионы и страны

`VISITED_REGIONS` - это lookup-объект:

```ts
export const VISITED_REGIONS: Record<string, boolean> = {
  RU: true,
  'RU-MOW': true,
};
```

Ключи стран не содержат `-`, ключи регионов обычно содержат. Подсчеты в `src/config.tsx` завязаны на эту договоренность.

`PLACES_CONFIG.countriesWithRegions` определяет, какие страны показываются через регионы, а не через один закрашенный полигон страны.

`PLACES_CONFIG.isDisputedRussiaRegion()` относит выбранные украинские региональные коды к российской группировке для статистики и hover-подсветки. Менять это нужно аккуратно: функция влияет и на отображение, и на счетчики.

## Как обновлять данные границ

Свежие JSON с границами генерируются из Yandex Maps API прямо в браузере:

1. Запустить приложение:

```sh
yarn dev
```

2. Открыть страницу в браузере.
3. В консоли браузера вызвать:

```js
window.downloadBorders();
```

4. Заменить скачанными файлами `public/countries.json` и/или `public/regions.json`.

`downloadBorders.ts` использует `ymaps.borders.load()` с `quality: 3`. Повышение качества увеличит размер JSON и цену старта приложения; снижение качества ускорит загрузку, но сделает полигоны менее детальными.

## Команды

Используется Yarn Classic, это соответствует текущему `yarn.lock`.

- `yarn dev` - запустить локальный Vite dev server.
- `yarn build` - выполнить TypeScript build и production-сборку Vite.
- `yarn preview` - локально открыть production-сборку.
- `yarn lint` - запустить ESLint с `--fix`; команда может менять файлы.
- `yarn format` - прогнать Prettier по JS/TS/TSX/HTML/CSS файлам.
- `yarn deploy` - собрать проект и опубликовать `dist` в GitHub Pages через `gh-pages`.

Перед передачей изменений стоит запускать минимум `yarn build`.

## Текущие заметки по производительности

- Production JS/CSS небольшие, но старт доминируют JSON с границами: примерно 24 MB raw суммарно и около 10 MB gzip суммарно.
- Оба файла с границами загружаются и парсятся сразу при инициализации карты.
- Каждая страна и каждый настроенный регион превращаются в `ymaps.GeoObject` на старте.
- Hover-обработчики регионов используют заранее построенный `regionsByCountry`, чтобы подсвечивать только регионы нужной страны.
- Иконки маркеров встроены base64-строками в `src/config.tsx`: это упрощает деплой, но раздувает JS и делает конфиг тяжелым для чтения.

## Заметки для будущих агентов

- Не менять `base` в `vite.config.ts` и fetch-пути через `import.meta.env.BASE_URL`, если не меняется цель деплоя.
- Не удалять module-level singleton `map` в `Map.tsx` без замены механизма защиты от двойной инициализации. Он нужен из-за React StrictMode в development.
- Перед расширением логики карты лучше типизировать Yandex GeoJSON и использование `ymaps`: сейчас есть несколько осознанных `any` и `@ts-ignore`.
- Не запускать `yarn lint` просто для проверки без необходимости: в скрипте есть `--fix`.
- `dist` и `node_modules` игнорируются и не должны попадать в коммит.
- При добавлении новой локации выбирайте подходящий `src/VISITED_*` файл. `src/VISITED_LOCATIONS.ts` нужно менять только при добавлении нового списка/типа.
- Также нужно обновить `VISITED_REGIONS`, если новая локация должна влиять на раскраску страны/региона и статистику.
- При изменении типов маркеров или поведения иконок нужно проверять и `src/types.ts`, и `PLACES_CONFIG.getLocationIcon()`.
