import { PLACES_CONFIG } from '../config';
import { download } from './download';

export const downloadCountriesJson = async () => {
  let countries = await ymaps.borders.load('001', {
    lang: PLACES_CONFIG.lang,
    quality: 3,
  });

  countries = countries.features.reduce((acc: any, feature: any) => {
    acc[feature.properties.iso3166] = feature;

    return acc;
  }, {});

  download(JSON.stringify(countries), 'countries.json');
};

export const downloadRegionsJson = async () => {
  let regions = await Promise.all(
    PLACES_CONFIG.countriesWithRegions.map((region) => {
      return ymaps.borders.load(region, {
        lang: PLACES_CONFIG.lang,
        quality: 3,
      });
    }),
  );

  regions = regions.reduce((acc, region) => {
    region.features.forEach((feature: any) => {
      acc[feature.properties.iso3166] = feature;
    });

    return acc;
  }, {});

  download(JSON.stringify(regions), 'regions.json');
};

export const downloadBorders = async () => {
  await downloadCountriesJson();
  await downloadRegionsJson();
};
