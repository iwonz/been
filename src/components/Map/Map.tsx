import { useEffect, useState } from 'react';
import { PLACES_CONFIG } from '../../config';
import { isVisitedRegionOrCountry } from '../../utils/isVisitedRegionOrCountry';
import { loadBorders } from '../../utils/loadBorders';
import { VISITED_LOCATIONS } from '../../VISITED_LOCATIONS';
import styles from './Map.module.css';

let map: any = null;
let initialization: ReturnType<typeof initializeMap> | undefined;

const getRegionCountryIsoCode = (regionIsoCode: string) => {
  return PLACES_CONFIG.isDisputedRussiaRegion(regionIsoCode) ? 'RU' : regionIsoCode.split('-')[0];
};

async function initializeMap() {
  map = new ymaps.Map('map', PLACES_CONFIG.yandexMapState, PLACES_CONFIG.yandexMapOptions);

  const fullScreenControl = new ymaps.control.FullscreenControl();
  map.controls.add(fullScreenControl);

  const searchControl = new ymaps.control.SearchControl({
    options: {
      size: 'small',
      provider: 'yandex#map',
      noPlacemark: true,
    },
  });
  map.controls.add(searchControl);

  const countriesGeoObjectCollection = new ymaps.GeoObjectCollection();
  const regionsGeoObjectCollection = new ymaps.GeoObjectCollection();
  const placesGeoObjectCollection = new ymaps.GeoObjectCollection();
  map.geoObjects.add(countriesGeoObjectCollection);
  map.geoObjects.add(regionsGeoObjectCollection);
  map.geoObjects.add(placesGeoObjectCollection);

  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  VISITED_LOCATIONS.forEach((location) => {
    const balloonContent = PLACES_CONFIG.getBalloonContent(location);
    const locationIcon = PLACES_CONFIG.getLocationIcon(location);

    const placemark = new ymaps.Placemark(
      location.coordinates,
      {
        hintContent: location.name,
        balloonContent,
      },
      {
        iconLayout: 'default#image',
        iconImageHref: locationIcon.icon,
        iconImageSize: locationIcon.size,
        iconImageOffset: locationIcon.offset,
      },
    );

    placesGeoObjectCollection.add(placemark);
  });

  const countries = loadBorders(`${import.meta.env.BASE_URL}countries.json`, (country) => {
    const countryIsoKey = country.properties.iso3166;
    const isWithRegions = PLACES_CONFIG.isCountryWithRegions(countryIsoKey);

    country.properties.hintContent = isWithRegions ? null : country.properties.name;

    const countryGeoObject = new ymaps.GeoObject(country, {
      fillOpacity: isWithRegions ? 0 : 0.5,
      fillColor: isVisitedRegionOrCountry(countryIsoKey)
        ? PLACES_CONFIG.visitedRegionFillColor
        : PLACES_CONFIG.notVisitedRegionFillColor,
      strokeWidth: 0,
      strokeColor: '#db757f',
      strokeOpacity: isWithRegions ? 0.5 : 1,
    });

    if (!isWithRegions) {
      countryGeoObject.events.add('mouseenter', () => {
        countryGeoObject.options.set('strokeWidth', 1);
      });

      countryGeoObject.events.add('mouseleave', () => {
        countryGeoObject.options.set('strokeWidth', 0);
      });
    }

    countriesGeoObjectCollection.add(countryGeoObject);
  });

  const regionsByCountry: Record<string, Array<typeof ymaps.GeoObject>> = {};
  let highlightedCountry: string | undefined;
  const regions = loadBorders(`${import.meta.env.BASE_URL}regions.json`, (region) => {
    const regionIsoCode = region.properties.iso3166;
    const countryIsoCode = getRegionCountryIsoCode(regionIsoCode);

    const countryName = PLACES_CONFIG.regionCountryNames[countryIsoCode];
    if (!countryName) {
      throw new Error(`Missing country name: ${countryIsoCode}`);
    }
    region.properties.hintContent = `${countryName}, ${region.properties.name}`;

    const regionGeoObject = new ymaps.GeoObject(region, {
      fillOpacity: 0.5,
      fillColor: isVisitedRegionOrCountry(regionIsoCode)
        ? PLACES_CONFIG.visitedRegionFillColor
        : PLACES_CONFIG.notVisitedRegionFillColor,
      strokeWidth: highlightedCountry === countryIsoCode ? 0.3 : 0,
      strokeColor: '#db757f',
    });

    regionsByCountry[countryIsoCode] ??= [];
    regionsByCountry[countryIsoCode].push(regionGeoObject);

    regionGeoObject.events.add('mouseenter', () => {
      highlightedCountry = countryIsoCode;
      regionsByCountry[countryIsoCode].forEach((regionGeoObject) => {
        regionGeoObject.options.set('strokeWidth', 0.3);
      });

      regionGeoObject.options.set('strokeWidth', 1);
    });

    regionGeoObject.events.add('mouseleave', () => {
      highlightedCountry = undefined;
      regionsByCountry[countryIsoCode].forEach((regionGeoObject) => {
        regionGeoObject.options.set('strokeWidth', 0);
      });

      regionGeoObject.options.set('strokeWidth', 0);
    });

    regionsGeoObjectCollection.add(regionGeoObject);
  });
  return { countries, regions };
}

export const TravelMap = ({ apiReady }: { apiReady: Promise<void> }) => {
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const report = (message: string) => {
      if (active) setErrors((previous) => [...previous, message]);
    };
    apiReady
      .then(() => {
        initialization ??= initializeMap();
        return initialization;
      })
      .then(({ countries, regions }) => {
        countries.catch(() => report('Не удалось загрузить границы стран. Обновите страницу.'));
        regions.catch(() => report('Не удалось загрузить границы регионов. Обновите страницу.'));
      })
      .catch(() => report('Не удалось загрузить карту. Обновите страницу.'));
    return () => {
      active = false;
    };
  }, [apiReady]);

  return (
    <div className={styles.container}>
      <div id="map" className={styles.map} />
      {errors.length > 0 && (
        <div className={styles.error} role="alert">
          {errors.map((message) => (
            <div key={message}>{message}</div>
          ))}
        </div>
      )}
      {PLACES_CONFIG.isStatsVisible && (
        <div className={styles.stats}>{PLACES_CONFIG.getStatsContent()}</div>
      )}
    </div>
  );
};
