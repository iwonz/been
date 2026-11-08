# Been

Интерактивная карта поездок на Vite + React + TypeScript с использованием Yandex Maps JavaScript API.

Проект показывает посещенные страны, регионы и точки на карте: города, места, аэропорты и прыжки с верёвкой. Для некоторых точек есть балуны со ссылками на связанные посты или истории.

## Стек

- Vite
- React
- TypeScript
- Yandex Maps JavaScript API
- Yarn Classic
- Biome и Knip

## Запуск

Для разработки нужен Node.js 22.12.0 или новее; в `.nvmrc` выбрана ветка Node.js 24. Используется Yarn Classic 1.22.22.

Установить зависимости:

```sh
yarn install --frozen-lockfile
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

Ключ Yandex Maps JavaScript API передается в параметре `apikey` в `src/main.tsx` и виден браузеру. В кабинете Яндекса [ограничьте его использование доменами](https://yandex.ru/maps-api/docs/js-api/limit.html): `iwonz.github.io` для сайта и используемыми локальными адресами для разработки. Настройки ограничений хранятся в кабинете Яндекса, а не в репозитории.

После создания ключа [активация может занять до 15 минут](https://yandex.ru/dev/jsapi-v2-1/doc/ru/). До активации API может сообщать `Invalid API key`.

## Основные команды

- `yarn dev` - локальная разработка.
- `yarn build` - TypeScript build и Vite production build.
- `yarn preview` - preview production-сборки.
- `yarn lint` - проверка Biome: lint, форматирование и импорты, без изменения файлов.
- `yarn lint:fix` - безопасные автоматические исправления Biome.
- `yarn format` - форматирование Biome с записью файлов.
- `yarn knip` - поиск неиспользуемых файлов, экспортов и зависимостей.
- `yarn verify` - Biome, Knip и production-сборка; обязательная локальная проверка перед слиянием.
- `yarn audit` - проверка известных уязвимостей всех зависимостей; требует доступ к сети.
- `yarn deploy` - сборка и публикация `dist` в GitHub Pages.

## Работа с агентами через OpenSpec

Репозиторий настроен на [OpenSpec](https://github.com/Fission-AI/OpenSpec) со схемой `spec-driven` и навыками для Codex. Инструкции для всех агентов находятся в [AGENTS.md](AGENTS.md), контекст и правила создания артефактов — в [openspec/config.yaml](openspec/config.yaml).

Для CLI нужен Node.js 20.19.0 или новее. Использованная при настройке версия OpenSpec — 1.11.0. На новой машине установить ее отдельно от зависимостей приложения:

```sh
npm install -g @fission-ai/openspec@1.11.0
openspec --version
```

Навыки уже находятся в репозитории, поэтому после клонирования повторный `init` не нужен. Открыть новую сессию агента, чтобы он обнаружил их.

Пример работы в чате Codex (это сообщения агенту, не команды терминала):

```text
$openspec-propose add-location-filters: добавить фильтры маркеров по типу
$openspec-apply-change add-location-filters
$openspec-archive-change add-location-filters
```

`propose` готовит описание изменения, требования, задачи и при необходимости техническое решение. После просмотра артефактов `apply-change` выполняет задачи. После проверок `archive-change` синхронизирует основные спецификации и переносит изменение в архив. Для исследования есть `$openspec-explore`, для корректировки плана — `$openspec-update-change`, для отдельной синхронизации реализованных требований — `$openspec-sync-specs`. Можно также описать задачу обычным текстом и попросить выполнить ее через OpenSpec.

Структура:

- `openspec/specs/` — спецификации текущего поведения: [карта](openspec/specs/travel-map/spec.md), [маркеры](openspec/specs/location-markers/spec.md), [статистика](openspec/specs/travel-statistics/spec.md).
- `openspec/changes/<change-name>/` — предложение, delta-спецификации, решение и задачи одного изменения.
- `openspec/changes/archive/` — завершенные изменения.
- `.agents/skills/` — сгенерированные навыки OpenSpec для Codex.

В терминале из корня репозитория:

```sh
openspec list
openspec list --specs
openspec validate --all --strict --no-interactive
yarn verify
```

Новые возможности и изменения поведения проходят через OpenSpec. Опечатки, небольшие правки документации, новые точки по существующей модели и исправления до уже описанного поведения не требуют отдельного change, если пользователь не попросил его явно. Исходные спецификации составлены по текущему коду; они не означают, что все сценарии покрыты автотестами.

Для повторной генерации того же набора навыков выполнить `openspec init --tools codex --profile core`. При обновлении версии CLI повторно сгенерировать навыки и проверить diff. Проектные правила хранить в `AGENTS.md` и `openspec/config.yaml`.

## Полный цикл доработки

Для любой доработки, включая документацию и данные, обязательны [правила Git-цикла](AGENTS.md#обязательный-git-цикл):

1. Проверить чистоту дерева, перейти на `main` и обновить ее через `git fetch origin` и `git merge --ff-only origin/main`.
2. Создать рабочую ветку `<type>/<short-kebab-case>`, например `feat/location-filters` или `fix/map-initialization`.
3. Выполнить доработку, сразу проверяя каждую логическую часть и создавая осмысленные [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), например `fix(map): prevent duplicate initialization`.
4. Получить успешные результаты `yarn verify`, `openspec validate --all --strict --no-interactive`, `git diff --check` и проверок затронутого поведения. При обновлении зависимостей также выполнить `yarn audit`. При наличии OpenSpec change синхронизировать спецификации, архивировать change и закоммитить артефакты.
5. Слить проверенную ветку в актуальную `main` через `git merge --ff-only <work-branch>`. Если `main` продвинулась, сначала объединить изменения в рабочей ветке и проверить результат.
6. Повторить проверки на `main`, удалить слитую рабочую ветку и убедиться, что `git status --porcelain=v1` пуст.

Запрос агенту на реализацию включает весь этот цикл без отдельных напоминаний о коммитах и слиянии. Явный запрос только на планирование или запрет слияния ограничивает цикл. Основная ветка называется `main`. Push и деплой выполняются, когда входят в запрос; в итоговом отчете агент сообщает об оставшихся неопубликованных коммитах.

## Структура проекта

- `src/main.tsx` - загружает Yandex Maps API и запускает React-приложение.
- `src/components/Map/Map.tsx` - основная логика карты: создание карты, маркеры, страны, регионы и hover-подсветка.
- `src/config.tsx` - настройки карты, цвета, статистика, иконки и содержимое балунов.
- `src/VISITED_LOCATIONS.ts` - единый агрегирующий экспорт `VISITED_LOCATIONS`.
- `src/VISITED_CITIES.ts`, `src/VISITED_PLACES.ts`, `src/VISITED_AIRPORTS.ts`, `src/VISITED_JUMPS.ts` - отдельные списки точек по типам.
- `src/VISITED_REGIONS.ts` - список посещенных стран и регионов.
- `src/types.ts` - общие типы данных.
- `biome.json` - правила lint, форматирования и импортов; большие JSON границ исключены из обработки.
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
- `VISITED_JUMPS.ts` - прыжки с верёвкой.

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
