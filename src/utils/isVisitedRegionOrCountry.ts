import { VISITED_REGIONS } from '../VISITED_REGIONS';

export const isVisitedRegionOrCountry = (isoCode: string): boolean => {
  return VISITED_REGIONS[isoCode] === true;
};
