import { ReactNode } from 'react';
import { Location, LocationIcon, LocationType } from './types';
import { VISITED_REGIONS } from './VISITED_REGIONS';
import { VISITED_LOCATIONS } from './VISITED_LOCATIONS';

type PlacesConfig = {
  lang: string;
  mapLang: string;
  notVisitedRegionFillColor: string;
  visitedRegionFillColor: string;
  countriesWithRegions: string[];

  isCountryWithRegions: (countryIsoKey: string) => boolean;

  isDisputedRussiaRegion: (isoKey: string) => boolean;
  yandexMapState: any; // https://yandex.ru/dev/jsapi-v2-1/doc/ru/v2-1/ref/reference/Map
  yandexMapOptions: any; // https://yandex.ru/dev/jsapi-v2-1/doc/ru/v2-1/ref/reference/Map
  isStatsVisible: boolean;
  getStatsContent: () => ReactNode;

  getLocationIcon: (location: Location) => LocationIcon;

  getBalloonContent: (location: Location) => any;
};

export const PLACES_CONFIG: PlacesConfig = {
  lang: 'ru',
  mapLang: 'ru_RU',
  notVisitedRegionFillColor: '#e2e2e2',
  visitedRegionFillColor: '#80ff80',
  countriesWithRegions: ['RU', 'BY', 'UA'],
  isCountryWithRegions: (countryIsoKey: string) =>
    PLACES_CONFIG.countriesWithRegions.includes(countryIsoKey),
  isDisputedRussiaRegion: (isoKey: string) =>
    [
      'UA-09', // Луганская область
      'UA-23', // Запорожская область
      'UA-65', // Херсонская область
      'UA-14', // Донецкая область
    ].includes(isoKey),
  yandexMapState: {
    type: 'yandex#map',
    center: [55.755864, 37.617698],
    zoom: 4,
    minZoom: 4,
    maxZoom: 16,
    controls: ['rulerControl'],
  },
  yandexMapOptions: {
    autoFitToViewport: 'always',
    suppressMapOpenBlock: true,
    suppressObsoleteBrowserNotifier: true,
    yandexMapAutoSwitch: false,
  },
  isStatsVisible: true,
  getStatsContent: () => {
    return (
      <>
        <div>🌎 {VISITED_COUNTRIES_COUNT} стран</div>
        <div>🏙️ {VISITED_CITIES_COUNT} населённых пунктов</div>
        <div>🇷🇺 {VISITED_RUSSIA_REGIONS_COUNT} из 89 регионов России</div>
        <div>✈️ {VISITED_AIRPORTS_COUNT} аэропортов</div>
      </>
    );
  },
  getLocationIcon: (location: Location) => {
    if (location.actions?.length) {
      return {
        icon: 'data:image/png;base64,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',
        size: [36, 36],
        offset: [-16, -28],
      };
    }

    switch (location.type) {
      case LocationType.CITY:
        return {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABqUlEQVR4nO2cO2rDQBRFtTwvaAyzh9enSRqjRRhUewvuplEdEEIbmDRuIkgkjeb7fC68bkD4+L6fzLjrEEIIJZOVL18ymv9qLQDjABy/l6yhzoEjAPeBso1EV5tsBVBUABwzp6qa2mgBCMCisjgwDUDz8fg3cp9vrgYaAMYBKPf5V2w5KtX5Zh0oADwH0FADAZhUljEGgEVlcSAAVXZhud6qCABeGwcooYP06wO451IkAPisDODwefElwmlxIAAjAfRTnyXUOhCAgQLgSQGw8mYxHIytTedoRKuBpcEMWgDmahY+sDuvN5zQAOAdgD7EgaTwdC6FATjVvaGobyIOgD0APQ48nsJ/FW+f+JyaJgLASABlNcmnPqdmEwGgEoCm9RooAGwboGt1kAbghgC44EBHCj/owoYxpu4mImwi/XsDNLyNAaB559+FXaubSOkYANgD0OPAdClsdr5/i53Coe/9qquBBoBxAMrG4JrKgUcH5modKAAEoODAmRT21MCZJkITOSC68MIYI8yBffuDdOoLMMPJ56yv5u99bvIr/wC85f3PBIS6EP0ATAc8gUQNmMwAAAAASUVORK5CYII=',
          size: [25, 25],
          offset: [-16, -28],
        };
      case LocationType.AIPORT:
        return {
          icon: 'data:image/png;base64,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',
          size: [36, 36],
          offset: [-16, -28],
        };
    }

    return {
      icon: 'data:image/png;base64,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',
      size: [36, 36],
      offset: [-16, -28],
    };
  },
  getBalloonContent: (location: Location) => {
    if (location.actions) {
      const actions = location.actions
        .map((link) => {
          return `<li><a href="${link.url}" target="_blank">${link.name}</a></li>`;
        })
        .join('');

      return `События в этом месте:<br /><ul>${actions}</ul>`;
    }

    return null;
  },
};

export const VISITED_COUNTRIES_COUNT = Object.keys(VISITED_REGIONS).filter(
  (isoKey) => !isoKey.includes('-'),
).length;

export const VISITED_RUSSIA_REGIONS_COUNT = Object.keys(VISITED_REGIONS).filter(
  (isoKey) => isoKey.startsWith('RU-') || PLACES_CONFIG.isDisputedRussiaRegion(isoKey),
).length;

export const VISITED_CITIES_COUNT = VISITED_LOCATIONS.filter(
  (location) => location.type === LocationType.CITY,
).length;

export const VISITED_AIRPORTS_COUNT = VISITED_LOCATIONS.filter(
  (location) => location.type === LocationType.AIPORT,
).length;
