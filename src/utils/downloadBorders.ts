import { PLACES_CONFIG } from '../config';
import type { Border, Borders } from '../types';
import { download } from './download';
import { roundBorderCoordinates } from './roundBorderCoordinates';

const downloadCountriesJson = async (borders: typeof ymaps.borders) => {
  const result: { features: Border[] } = await borders.load('001', {
    lang: PLACES_CONFIG.lang,
    quality: 3,
  });

  const countries = result.features.reduce<Borders>((acc, feature) => {
    acc[feature.properties.iso3166] = feature;

    return acc;
  }, {});

  download(JSON.stringify(roundBorderCoordinates(countries)), 'countries.json');
};

const downloadRegionsJson = async (borders: typeof ymaps.borders) => {
  const results: { features: Border[] }[] = await Promise.all(
    PLACES_CONFIG.countriesWithRegions.map((region) => {
      return borders.load(region, {
        lang: PLACES_CONFIG.lang,
        quality: 3,
      });
    }),
  );

  const regions = results.reduce<Borders>((acc, region) => {
    region.features.forEach((feature) => {
      acc[feature.properties.iso3166] = feature;
    });

    return acc;
  }, {});

  download(JSON.stringify(roundBorderCoordinates(regions)), 'regions.json');
};

export const downloadBorders = async () => {
  const [borders] = await ymaps.modules.require(['borders']);
  await downloadCountriesJson(borders);
  await downloadRegionsJson(borders);
};
