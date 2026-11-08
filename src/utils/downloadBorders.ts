import { PLACES_CONFIG } from '../config';
import type { Border, Borders } from '../types';
import { download } from './download';
import { roundBorderCoordinates } from './roundBorderCoordinates';

const downloadCountriesJson = async () => {
  const result: { features: Border[] } = await ymaps.borders.load('001', {
    lang: PLACES_CONFIG.lang,
    quality: 3,
  });

  const countries = result.features.reduce<Borders>((acc, feature) => {
    acc[feature.properties.iso3166] = feature;

    return acc;
  }, {});

  download(JSON.stringify(roundBorderCoordinates(countries)), 'countries.json');
};

const downloadRegionsJson = async () => {
  const results: { features: Border[] }[] = await Promise.all(
    PLACES_CONFIG.countriesWithRegions.map((region) => {
      return ymaps.borders.load(region, {
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
  await downloadCountriesJson();
  await downloadRegionsJson();
};
