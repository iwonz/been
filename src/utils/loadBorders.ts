import type { Border } from '../types';
import { forEachInBatches } from './forEachInBatches.ts';

export const loadBorders = async (url: string, addBorder: (border: Border) => void) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: HTTP ${response.status}`);
  }
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`Invalid borders: ${url}`);
  }

  await forEachInBatches(Object.entries(data), ([code, value]) => {
    const border = value as Border | null;
    if (
      border?.type !== 'Feature' ||
      border.properties?.iso3166 !== code ||
      typeof border.properties?.name !== 'string' ||
      border.geometry?.type !== 'Polygon' ||
      !Array.isArray(border.geometry.coordinates) ||
      !border.geometry.coordinates.length ||
      !border.geometry.coordinates.every(
        (ring) =>
          Array.isArray(ring) &&
          ring.length >= 3 &&
          ring.every(
            (point) => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite),
          ),
      )
    ) {
      throw new Error(`Invalid border ${code}: ${url}`);
    }
    addBorder(border);
  });
};
