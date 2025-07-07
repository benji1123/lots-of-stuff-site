export interface ActivityEntry {
  id: string | number;
  title: string;
  description?: string;
  metric?: string;
  source: 'steam' | 'strava' | 'instagram';
  emoji?: string;
  color?: string;
  [key: string]: any; 
}

// https://open-meteo.com/en/docs?latitude=49.246292&longitude=-123.116226&timezone=auto&hourly=&forecast_days=1&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m#settings
export type OpenMeteoCurrentWeather = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    is_day: string;
    precipitation: string;
    rain: string;
    weather_code: string;
    cloud_cover: string;
    pressure_msl: string;
    surface_pressure: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    is_day: number;
    precipitation: number;
    rain: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  any: any; // in case more fields are added
};
