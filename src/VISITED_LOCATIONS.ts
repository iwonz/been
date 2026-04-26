import { VISITED_CITIES } from './VISITED_CITIES';
import { VISITED_PLACES } from './VISITED_PLACES';
import { VISITED_AIRPORTS } from './VISITED_AIRPORTS';
import { VISITED_JUMPS } from './VISITED_JUMPS';
import { VISITED_CAFES } from './VISITED_CAFES';
import { Location } from './types';

export const VISITED_LOCATIONS: Location[] = [
  ...VISITED_CITIES,
  ...VISITED_PLACES,
  ...VISITED_AIRPORTS,
  ...VISITED_JUMPS,
  ...VISITED_CAFES,
];
