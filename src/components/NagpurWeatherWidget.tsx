'use client';
import React, { useEffect, useState } from 'react';
import { CloudRain, Thermometer, Droplets, Wind, AlertCircle } from 'lucide-react';

interface WeatherData {
  currentTemp: number;
  apparentTemp: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  weatherText: string;
}

function getWeatherText(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code >= 1 && code <= 3) return 'Partly Cloudy / Overcast';
  if (code >= 51 && code <= 67) return 'Rain / Monsoon Drizzle';
  if (code >= 80 && code <= 82) return 'Heavy Monsoon Showers';
  if (code >= 95) return 'Thunderstorm Warning';
  return 'Humid / Monsoon Conditions';
}

export const NagpurWeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        'https://api.open-meteo.com/v1/forecast?latitude=21.1458&longitude=79.0882&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&timezone=Asia%2FKolkata';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch weather feed');
      const data = await res.json();

      setWeather({
        currentTemp: data.current?.temperature_2m ?? 25.9,
        apparentTemp: data.current?.apparent_temperature ?? 29.7,
        humidity: data.current?.relative_humidity_2m ?? 86,
        precipitation: data.current?.precipitation ?? 0.4,
        windSpeed: data.current?.wind_speed_10m ?? 13.6,
        weatherText: getWeatherText(data.current?.weather_code || 61),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching weather data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading && !weather) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm animate-pulse h-20" />
        ))}
      </div>
    );
  }

  if (error && !weather) {
    return null; // Silently hide if error occurs
  }

  if (!weather) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
      
      {/* 1. Temperature */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Temperature</span>
          <Thermometer className="w-4 h-4 text-rose-500" />
        </div>
        <div className="mt-2">
          <span className="text-xl font-extrabold text-slate-900">{weather.currentTemp}°C</span>
          <span className="text-[11px] text-slate-500 block font-medium mt-0.5">
            Feels like {weather.apparentTemp}°C
          </span>
        </div>
      </div>

      {/* 2. Relative Humidity */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Relative Humidity</span>
          <Droplets className="w-4 h-4 text-cyan-600" />
        </div>
        <div className="mt-2">
          <span className="text-xl font-extrabold text-cyan-700">{weather.humidity}%</span>
          <span className="text-[11px] text-emerald-700 block font-semibold mt-0.5">
            High Humidity Level
          </span>
        </div>
      </div>

      {/* 3. Precipitation / Rain */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Precipitation / Rain</span>
          <CloudRain className="w-4 h-4 text-blue-600" />
        </div>
        <div className="mt-2">
          <span className="text-xl font-extrabold text-blue-600">{weather.precipitation} mm</span>
          <span className="text-[11px] text-slate-500 block font-medium mt-0.5">
            {weather.weatherText}
          </span>
        </div>
      </div>

      {/* 4. Wind Velocity */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Wind Velocity</span>
          <Wind className="w-4 h-4 text-teal-600" />
        </div>
        <div className="mt-2">
          <span className="text-xl font-extrabold text-slate-900">{weather.windSpeed} km/h</span>
          <span className="text-[11px] text-slate-500 block font-medium mt-0.5">
            Nagpur Surface Wind
          </span>
        </div>
      </div>

    </div>
  );
};
