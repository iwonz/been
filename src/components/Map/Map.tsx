import { useEffect } from 'react';
import { VISITED_LOCATIONS } from '../../VISITED_LOCATIONS';
import styles from './Map.module.css';
import { PLACES_CONFIG } from '../../config';
import { isVisitedRegionOrCountry } from '../../utils/isVisitedRegionOrCountry';

let map: any = null;

async function initializeMap() {
  if (map) {
    return;
  }

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

  // Render locations
  const placesGeoObjectCollection = new ymaps.GeoObjectCollection();
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
  map.geoObjects.add(placesGeoObjectCollection);
  // End of render locations

  Promise.all([
    fetch(`${import.meta.env.BASE_URL}countries.json`).then((res) => res.json()),
    fetch(`${import.meta.env.BASE_URL}regions.json`).then((res) => res.json()),
  ]).then(([COUNTRIES_BORDERS, REGIONS_BORDERS]) => {
    // Render countries
    const countriesGeoObjectCollection = new ymaps.GeoObjectCollection();
    const countriesGeoObjects: Record<string, typeof ymaps.GeoObject> = {};
    Object.keys(COUNTRIES_BORDERS).forEach((countryIsoKey) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const country = COUNTRIES_BORDERS[countryIsoKey];
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

      countriesGeoObjects[countryIsoKey] = countryGeoObject;

      countriesGeoObjectCollection.add(countryGeoObject);
    });
    map.geoObjects.add(countriesGeoObjectCollection);
    // End of render countries

    // Render regions
    const regionsGeoObjectCollection = new ymaps.GeoObjectCollection();
    const regionsGeoObjects: Record<string, typeof ymaps.GeoObject> = {};
    Object.keys(REGIONS_BORDERS).forEach((regionIsoCode) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const region = REGIONS_BORDERS[regionIsoCode];
      const countryIsoCode = PLACES_CONFIG.isDisputedRussiaRegion(regionIsoCode)
        ? 'RU'
        : regionIsoCode.split('-')[0];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      region.properties.hintContent = `${COUNTRIES_BORDERS[countryIsoCode].properties.name}, ${region.properties.name}`;

      const regionGeoObject = new ymaps.GeoObject(region, {
        fillOpacity: 0.5,
        fillColor: isVisitedRegionOrCountry(regionIsoCode)
          ? PLACES_CONFIG.visitedRegionFillColor
          : PLACES_CONFIG.notVisitedRegionFillColor,
        strokeWidth: 0,
        strokeColor: '#db757f',
      });

      regionsGeoObjects[regionIsoCode] = regionGeoObject;

      regionGeoObject.events.add('mouseenter', () => {
        Object.keys(REGIONS_BORDERS).forEach((regionIsoCode) => {
          const isDisputedRegion = PLACES_CONFIG.isDisputedRussiaRegion(regionIsoCode);

          const isHighlighted =
            (isDisputedRegion && countryIsoCode === 'RU') ||
            (regionIsoCode.startsWith(countryIsoCode) && !isDisputedRegion);

          if (isHighlighted) {
            regionsGeoObjects[regionIsoCode].options.set('strokeWidth', 0.3);
          }
        });

        regionGeoObject.options.set('strokeWidth', 1);
      });

      regionGeoObject.events.add('mouseleave', () => {
        Object.keys(REGIONS_BORDERS).forEach((regionIsoCode) => {
          const isDisputedRegion = PLACES_CONFIG.isDisputedRussiaRegion(regionIsoCode);

          const isHighlighted =
            (isDisputedRegion && countryIsoCode === 'RU') ||
            (regionIsoCode.startsWith(countryIsoCode) && !isDisputedRegion);

          if (isHighlighted) {
            regionsGeoObjects[regionIsoCode].options.set('strokeWidth', 0);
          }
        });

        regionGeoObject.options.set('strokeWidth', 0);
      });

      regionsGeoObjectCollection.add(regionGeoObject);
    });
    map.geoObjects.add(regionsGeoObjectCollection);
    // End of render regions
  });
}

export const Map = () => {
  useEffect(() => {
    ymaps.ready(() => {
      initializeMap();
    });
  }, []);

  return (
    <div className={styles.container}>
      <div id="map" className={styles.map} />
      {PLACES_CONFIG.isStatsVisible && (
        <div className={styles.stats}>{PLACES_CONFIG.getStatsContent()}</div>
      )}
    </div>
  );
};
