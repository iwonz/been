import type { Location } from './types';
import { VISITED_AIRPORTS } from './VISITED_AIRPORTS';
import { VISITED_CITIES } from './VISITED_CITIES';
import { VISITED_JUMPS } from './VISITED_JUMPS';
import { VISITED_PLACES } from './VISITED_PLACES';

export const VISITED_LOCATIONS: Location[] = [
  ...VISITED_CITIES,
  ...VISITED_PLACES,
  ...VISITED_AIRPORTS,
  ...VISITED_JUMPS,
];
