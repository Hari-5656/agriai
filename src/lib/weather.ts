// Open-Meteo integration (no API key required)

export interface RapidCurrentResponse {
  location: { name: string; region: string; country: string }
  current: {
    temp_c: number
    humidity: number
    wind_kph: number
    vis_km: number
    condition: { text: string; icon: string }
  }
}

// For compatibility with the UI which expects `forecastRes.list`
export interface OpenWeatherLikeForecastItem {
  dt: number
  main: { temp_min: number; temp_max: number }
  pop: number | undefined
  weather: Array<{ description: string }>
}

export interface RapidForecastResponseLike {
  list: OpenWeatherLikeForecastItem[]
}

interface GeocodingResponse {
  results?: Array<{
    name: string
    country: string
    admin1?: string
    latitude: number
    longitude: number
  }>
}

function weatherCodeToDescription(code: number): string {
  // Simplified mapping for common codes
  const map: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Rain showers',
    81: 'Rain showers',
    82: 'Heavy rain showers',
    95: 'Thunderstorm',
  }
  return map[code] ?? 'Unknown'
}

async function geocode(query: string) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`)
  const data = (await res.json()) as GeocodingResponse
  const first = data.results?.[0]
  if (!first) throw new Error('Location not found')
  return first
}

export async function fetchCurrentWeatherByQuery(query: string): Promise<RapidCurrentResponse> {
  const place = await geocode(query)
  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current: ['temperature_2m', 'relative_humidity_2m', 'wind_speed_10m', 'weather_code', 'visibility'].join(','),
    timezone: 'auto',
  })
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather error ${res.status}`)
  const data = await res.json()

  const tempC = Number(data?.current?.temperature_2m)
  const humidity = Number(data?.current?.relative_humidity_2m)
  const windKph = Number(data?.current?.wind_speed_10m) // already in km/h by default
  const visibilityKm = data?.current?.visibility != null ? Math.round(Number(data.current.visibility) / 1000) : 10
  const conditionText = weatherCodeToDescription(Number(data?.current?.weather_code))

  const result: RapidCurrentResponse = {
    location: { name: place.name, region: place.admin1 || '', country: place.country },
    current: {
      temp_c: Math.round(tempC),
      humidity: Math.round(humidity),
      wind_kph: Math.round(windKph),
      vis_km: visibilityKm,
      condition: { text: conditionText, icon: '' },
    },
  }
  return result
}

export async function fetchForecastByQuery(query: string): Promise<RapidForecastResponseLike> {
  const place = await geocode(query)
  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    daily: ['temperature_2m_max', 'temperature_2m_min', 'precipitation_probability_max', 'weather_code'].join(','),
    timezone: 'auto',
    forecast_days: '5',
  })
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Forecast error ${res.status}`)
  const data = await res.json()

  const days: RapidForecastResponseLike['list'] = []
  const time = data?.daily?.time as string[] | undefined
  const tmin = data?.daily?.temperature_2m_min as number[] | undefined
  const tmax = data?.daily?.temperature_2m_max as number[] | undefined
  const pop = data?.daily?.precipitation_probability_max as number[] | undefined
  const wcode = data?.daily?.weather_code as number[] | undefined

  if (time && tmin && tmax) {
    for (let i = 0; i < time.length; i++) {
      const dt = Math.floor(new Date(time[i] + 'T12:00:00').getTime() / 1000)
      const item: OpenWeatherLikeForecastItem = {
        dt,
        main: { temp_min: Math.round(tmin[i]), temp_max: Math.round(tmax[i]) },
        pop: pop ? Math.round(pop[i]) / 100 : undefined,
        weather: [{ description: weatherCodeToDescription(wcode ? wcode[i] : 0) }],
      }
      days.push(item)
    }
  }

  return { list: days }
}

