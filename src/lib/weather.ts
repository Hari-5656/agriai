export interface CurrentWeatherResponse {
  name: string
  weather: { description: string; icon: string }[]
  main: { temp: number; humidity: number }
  wind: { speed: number }
  visibility: number
}

export interface ForecastListItem {
  dt: number
  main: { temp_min: number; temp_max: number }
  weather: { description: string; icon: string }[]
  pop: number
}

export interface ForecastResponse {
  list: ForecastListItem[]
}

const BASE = 'https://api.openweathermap.org/data/2.5'

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENWEATHER_KEY as string | undefined
  if (!key) throw new Error('Missing VITE_OPENWEATHER_KEY')
  return key
}

export async function fetchCurrentWeatherByQuery(query: string) {
  const key = getApiKey()
  const url = `${BASE}/weather?q=${encodeURIComponent(query)}&appid=${key}&units=metric`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather error ${res.status}`)
  const data = (await res.json()) as CurrentWeatherResponse
  return data
}

export async function fetchForecastByQuery(query: string) {
  const key = getApiKey()
  const url = `${BASE}/forecast?q=${encodeURIComponent(query)}&appid=${key}&units=metric`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Forecast error ${res.status}`)
  const data = (await res.json()) as ForecastResponse
  return data
}


