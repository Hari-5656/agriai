import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useLanguage } from './language-provider'
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Thermometer, 
  Droplets, 
  AlertTriangle,
  Bell,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react'
import { fetchCurrentWeatherByQuery, fetchForecastByQuery, type CurrentWeatherResponse, type ForecastResponse } from '../lib/weather'

interface WeatherAlert {
  id: string
  type: 'warning' | 'watch' | 'advisory'
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  startTime: string
  endTime: string
  affectedAreas: string[]
  recommendations: string[]
}

interface PestAlert {
  id: string
  pest: string
  crop: string
  severity: 'low' | 'medium' | 'high'
  description: string
  symptoms: string[]
  control: string[]
  timing: string
}

export function WeatherAlerts() {
  const { translate } = useLanguage()
  const [location, setLocation] = useState('Punjab, IN')
  const [current, setCurrent] = useState<CurrentWeatherResponse | null>(null)
  const [forecastRes, setForecastRes] = useState<ForecastResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function run() {
      if (!location) return
      setLoading(true)
      setError(null)
      try {
        const [cw, fc] = await Promise.all([
          fetchCurrentWeatherByQuery(location),
          fetchForecastByQuery(location)
        ])
        if (!active) return
        setCurrent(cw)
        setForecastRes(fc)
      } catch (e: any) {
        if (!active) return
        setError(e?.message || 'Failed to fetch weather')
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => { active = false }
  }, [location])

  const weatherAlerts: WeatherAlert[] = [
    {
      id: '1',
      type: 'warning',
      severity: 'high',
      title: 'Heavy Rainfall Warning',
      description: 'Heavy to very heavy rainfall expected in the next 48 hours. Rainfall may range from 75-150mm.',
      startTime: '2025-01-11 06:00',
      endTime: '2025-01-13 18:00',
      affectedAreas: ['Punjab', 'Haryana', 'Western UP'],
      recommendations: [
        'Postpone harvesting activities',
        'Ensure proper drainage in fields',
        'Protect stored grains from moisture',
        'Check irrigation channels for overflow'
      ]
    },
    {
      id: '2',
      type: 'advisory',
      severity: 'medium',
      title: 'Temperature Drop Advisory',
      description: 'Significant temperature drop expected. Minimum temperature may fall to 4-6°C.',
      startTime: '2025-01-12 22:00',
      endTime: '2025-01-15 08:00',
      affectedAreas: ['Northern Punjab', 'Himachal Pradesh'],
      recommendations: [
        'Protect young plants from frost',
        'Use mulching for sensitive crops',
        'Cover water sources to prevent freezing',
        'Monitor livestock for cold stress'
      ]
    }
  ]

  const pestAlerts: PestAlert[] = [
    {
      id: '1',
      pest: 'Brown Plant Hopper',
      crop: 'Rice',
      severity: 'high',
      description: 'High population of brown plant hoppers observed in rice fields. Can cause significant yield loss.',
      symptoms: [
        'Yellowing and drying of plants',
        'Hopper burn symptoms',
        'Stunted plant growth',
        'Reduced tillering'
      ],
      control: [
        'Apply recommended insecticides',
        'Use resistant varieties',
        'Maintain proper water levels',
        'Remove alternate hosts'
      ],
      timing: 'Immediate action required'
    },
    {
      id: '2',
      pest: 'Aphids',
      crop: 'Wheat',
      severity: 'medium',
      description: 'Moderate aphid infestation detected. Early intervention can prevent crop damage.',
      symptoms: [
        'Curling of leaves',
        'Sticky honeydew on plants',
        'Yellowing of foliage',
        'Reduced plant vigor'
      ],
      control: [
        'Spray neem-based insecticides',
        'Introduce beneficial insects',
        'Use reflective mulches',
        'Monitor regularly'
      ],
      timing: 'Action needed within 7 days'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'watch': return <Activity className="h-4 w-4" />
      case 'advisory': return <Bell className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const forecast = useMemo(() => {
    if (!forecastRes) return [] as { day: string; high: number; low: number; condition: string; rain: number }[]
    const days = new Map<string, { min: number; max: number; condition: string; pop: number }>()
    for (const item of forecastRes.list) {
      const d = new Date(item.dt * 1000)
      const key = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
      const min = item.main.temp_min
      const max = item.main.temp_max
      const condition = item.weather[0]?.description ?? '—'
      const pop = Math.round((item.pop ?? 0) * 100)
      const prev = days.get(key)
      if (!prev) days.set(key, { min, max, condition, pop })
      else days.set(key, { min: Math.min(prev.min, min), max: Math.max(prev.max, max), condition: prev.condition, pop: Math.max(prev.pop, pop) })
    }
    return Array.from(days.entries()).slice(0, 5).map(([day, v]) => ({ day, high: Math.round(v.max), low: Math.round(v.min), condition: v.condition, rain: v.pop }))
  }, [forecastRes])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-2">{translate('weatherAlerts')}</h1>
        <p className="text-muted-foreground">
          Stay updated with weather conditions and pest alerts for your farming area
        </p>
      </div>

      {/* Location Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Set Your Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="location">Enter your location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., District, State"
              />
            </div>
            <Button className="mt-6" onClick={() => setLocation(location)}>Update Location</Button>
          </div>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Current Weather {current ? `- ${current.name}` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : current ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Thermometer className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="font-medium">{Math.round(current.main.temp)}°C</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="font-medium">{current.main.humidity}%</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Wind className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                <p className="text-sm text-muted-foreground">Wind Speed</p>
                <p className="font-medium">{Math.round(current.wind.speed)} m/s</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <CloudRain className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-muted-foreground">Condition</p>
                <p className="font-medium text-sm">{current.weather[0]?.description ?? '—'}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p className="font-medium">{Math.round((current.visibility ?? 0) / 1000)} km</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter a valid location to fetch weather.</p>
          )}
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            5-Day Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="font-medium mb-2">{day.day}</p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <p className="font-medium">{day.high}°C</p>
                    <p className="text-muted-foreground">{day.low}°C</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{day.condition}</p>
                  <div className="flex items-center justify-center gap-1">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <span className="text-xs">{day.rain}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weatherAlerts.map((alert) => (
              <div key={alert.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(alert.type)}
                    <h4 className="font-medium">{alert.title}</h4>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span>From: {new Date(alert.startTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span>To: {new Date(alert.endTime).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Affected Areas:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {alert.affectedAreas.map((area, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{area}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Recommendations:</p>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      {alert.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pest Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Pest & Disease Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pestAlerts.map((alert) => (
              <div key={alert.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{alert.pest}</h4>
                    <p className="text-sm text-muted-foreground">Crop: {alert.crop}</p>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Symptoms:</p>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      {alert.symptoms.map((symptom, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Control Measures:</p>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      {alert.control.map((control, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          {control}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Timing: {alert.timing}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}