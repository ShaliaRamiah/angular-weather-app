export interface WeatherData {
  hourly: {
    apparent_temperature: number[];
    time: string[];
  };
  daily: {
    temperature_2m_min: number[];
    temperature_2m_max: number[];
  };
}

