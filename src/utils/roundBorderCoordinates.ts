import type { Borders } from '../types';

export const roundBorderCoordinates = (borders: Borders) => {
  for (const border of Object.values(borders)) {
    for (const ring of border.geometry.coordinates) {
      for (const point of ring) {
        point[0] = Number(point[0].toFixed(5));
        point[1] = Number(point[1].toFixed(5));
      }
    }
  }

  return borders;
};
