export enum LocationType {
  CITY,
  PLACE,
  AIPORT,
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
