// RapidAPI WeatherAPI.com types

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

export interface RapidForecastResponse {
  location: { name: string }
  forecast: {
    forecastday: Array<{
      date_epoch: number
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        daily_chance_of_rain: number
        condition: { text: string }
      }
    }>
  }
}

const RAPID_BASE = 'https://weatherapi-com.p.rapidapi.com'

function getRapidHeaders(): HeadersInit {
  const key = (import.meta as any).env?.VITE_RAPIDAPI_KEY as string | undefined
  const host = 'weatherapi-com.p.rapidapi.com'
  if (!key) throw new Error('Missing VITE_RAPIDAPI_KEY')
  return {
    'X-RapidAPI-Key': key,
    'X-RapidAPI-Host': host,
  }
}

export async function fetchCurrentWeatherByQuery(query: string) {
  const overrideUrlRaw = (import.meta as any).env?.VITE_RAPIDAPI_URL as string | undefined
  const sanitized = overrideUrlRaw?.trim().replace(/^@+/, '')
  const url = sanitized && sanitized.length > 0
    ? sanitized
    : `${RAPID_BASE}/current.json?q=${encodeURIComponent(query)}`
  const res = await fetch(url, { headers: getRapidHeaders() })
  if (!res.ok) {
    let body: string
    try { body = await res.text() } catch { body = '' }
    throw new Error(`Weather error ${res.status}: ${body}`)
  }
  const data = (await res.json()) as RapidCurrentResponse
  return data
}

export async function fetchForecastByQuery(query: string) {
  const overrideUrl = (import.meta as any).env?.VITE_RAPIDAPI_FORECAST_URL as string | undefined
  const url = overrideUrl ?? `${RAPID_BASE}/forecast.json?q=${encodeURIComponent(query)}&days=5`
  const res = await fetch(url, { headers: getRapidHeaders() })
  if (!res.ok) {
    let body: string
    try { body = await res.text() } catch { body = '' }
    throw new Error(`Forecast error ${res.status}: ${body}`)
  }
  const data = (await res.json()) as RapidForecastResponse
  return data
}


