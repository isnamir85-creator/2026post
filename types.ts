
export interface Resident {
  id: number;
  buildingName: string;
  unitNumber: string;
  tenant: string;
}

export type SearchMode = 'all' | 'building' | 'tenant' | 'unit';
export type SortMode = 'default' | 'name' | 'count' | 'unknown';

export interface WeatherData {
  date: string;
  location: string;
  am: {
    status: 'clear' | 'cloudy' | 'rainy' | 'snowy';
    temp: string;
    rainProb: string;
  };
  pm: {
    status: 'clear' | 'cloudy' | 'rainy' | 'snowy';
    temp: string;
    rainProb: string;
  };
}
