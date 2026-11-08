export enum LocationType {
  CITY,
  PLACE,
  AIRPORT,
  JUMP,
}

export interface Location {
  type: LocationType;
  name: string;
  coordinates: [number, number];
  actions?: Array<{
    name: string;
    url: string;
  }>;
}

export interface LocationIcon {
  icon: string;
  size: [number, number];
  offset: [number, number];
}

export interface Border {
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
  properties: {
    iso3166: string;
    name: string;
    hintContent?: string | null;
    [key: string]: unknown;
  };
}

export type Borders = Record<string, Border>;
