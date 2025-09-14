import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useLanguage } from './language-provider'
import { useNotifications } from '../contexts/NotificationContext'
import { NotificationService } from '../lib/notification-service'
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
  Activity,
  Navigation,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { 
  fetchCurrentWeatherByQuery, 
  fetchForecastByQuery, 
  fetchCurrentWeatherByCoordinates,
  fetchForecastByCoordinates,
  type RapidCurrentResponse, 
  type RapidForecastResponseLike 
} from '../lib/weather'
import { 
  locationService, 
  type LocationData, 
  type LocationError,
  type LocationPermission 
} from '../lib/location-service'

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
  const { addNotification } = useNotifications()
  const [location, setLocation] = useState('Punjab, IN')
  const [current, setCurrent] = useState<RapidCurrentResponse | null>(null)
  const [forecastRes, setForecastRes] = useState<RapidForecastResponseLike | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Location-related state
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [locationPermission, setLocationPermission] = useState<LocationPermission>({
    granted: false,
    denied: false,
    prompt: true
  })
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)

  // Check location permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      const permission = locationService.getPermissionStatus()
      setLocationPermission(permission)
      
      // Try to get cached location
      const cached = locationService.getCachedLocation()
      if (cached) {
        setCurrentLocation(cached)
        setUseCurrentLocation(true)
      }
    }
    checkPermission()
  }, [])

  // Handle getting current location
  const handleGetCurrentLocation = async () => {
    setLocationLoading(true)
    setLocationError(null)
    
    try {
      const locationData = await locationService.getCurrentLocation()
      setCurrentLocation(locationData)
      setUseCurrentLocation(true)
      setLocation(locationService.formatLocation(locationData))
      
      // Update permission status
      const permission = locationService.getPermissionStatus()
      setLocationPermission(permission)
      
      addNotification({
        id: `location-${Date.now()}`,
        type: 'success',
        title: 'Location Updated',
        message: `Weather updated for ${locationService.formatLocation(locationData)}`,
        timestamp: new Date()
      })
    } catch (error: any) {
      setLocationError(error.message || 'Failed to get current location')
      setLocationPermission({
        granted: false,
        denied: error.type === 'permission',
        prompt: error.type !== 'permission',
        error: error.message
      })
    } finally {
      setLocationLoading(false)
    }
  }

  // Handle manual location update
  const handleLocationUpdate = () => {
    setUseCurrentLocation(false)
    setCurrentLocation(null)
  }

  useEffect(() => {
    let active = true
    async function run() {
      if (!location) return
      setLoading(true)
      setError(null)
      try {
        let cw: RapidCurrentResponse
        let fc: RapidForecastResponseLike | null = null

        if (useCurrentLocation && currentLocation) {
          // Use current location coordinates
          cw = await fetchCurrentWeatherByCoordinates(
            currentLocation.latitude,
            currentLocation.longitude,
            currentLocation.address?.city,
            currentLocation.address?.state,
            currentLocation.address?.country
          )
          try {
            fc = await fetchForecastByCoordinates(
              currentLocation.latitude,
              currentLocation.longitude
            )
          } catch (e: any) {
            console.warn('Forecast fetch failed:', e?.message)
            setError((prev) => prev ?? (e?.message || 'Forecast fetch failed'))
          }
        } else {
          // Use location query
          cw = await fetchCurrentWeatherByQuery(location)
          try {
            fc = await fetchForecastByQuery(location)
          } catch (e: any) {
            console.warn('Forecast fetch failed:', e?.message)
            setError((prev) => prev ?? (e?.message || 'Forecast fetch failed'))
          }
        }
        
        if (!active) return
        setCurrent(cw)
        setForecastRes(fc)

        // Generate weather notifications based on conditions
        if (cw) {
          // Temperature alerts
          if (cw.current.temp_c > 40) {
            addNotification(NotificationService.generateWeatherNotification(
              'temperature', 'urgent', location, { temp: Math.round(cw.current.temp_c) }
            ))
          } else if (cw.current.temp_c < 5) {
            addNotification(NotificationService.generateWeatherNotification(
              'temperature', 'high', location, { temp: Math.round(cw.current.temp_c) }
            ))
          }

          // Wind alerts
          if (cw.current.wind_kph > 50) {
            addNotification(NotificationService.generateWeatherNotification(
              'wind', 'high', location, { speed: Math.round(cw.current.wind_kph) }
            ))
          }

          // Humidity alerts
          if (cw.current.humidity < 30) {
            addNotification(NotificationService.generateWeatherNotification(
              'drought', 'high', location, { humidity: cw.current.humidity }
            ))
          }
        }

        // Forecast-based notifications
        if (fc) {
          const highRainDays = fc.list.filter(item => (item.pop || 0) > 0.7).length
          if (highRainDays > 0) {
            addNotification(NotificationService.generateWeatherNotification(
              'rain', 'high', location, { amount: 'Heavy', days: highRainDays }
            ))
          }
        }
      } catch (e: any) {
        if (!active) return
        setError(e?.message || 'Failed to fetch weather')
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => { active = false }
  }, [location, useCurrentLocation, currentLocation, addNotification])

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
            {translate('setLocation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Location Section */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Navigation className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Current Location</p>
                <p className="text-sm text-muted-foreground">
                  {currentLocation ? locationService.formatLocation(currentLocation) : 'Not available'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {locationPermission.granted && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              {locationPermission.denied && (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              {locationPermission.prompt && !locationPermission.denied && (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleGetCurrentLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                {locationLoading ? 'Getting...' : 'Get Current Location'}
              </Button>
            </div>
          </div>

          {/* Manual Location Input */}
          <div className="space-y-2">
            <Label htmlFor="location">{translate('enterLocation')}</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  handleLocationUpdate()
                }}
                placeholder="e.g., District, State, Place"
                className="flex-1"
              />
              <Button 
                variant="outline"
                onClick={() => setLocation(location)}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Status Messages */}
          {locationError && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <XCircle className="h-4 w-4" />
              {locationError}
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          
        </CardContent>
      </Card>

      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            {translate('currentWeather')} {current ? `- ${current.location.name}` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : current ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Thermometer className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <p className="text-sm text-muted-foreground">{translate('temperature')}</p>
                <p className="font-medium">{Math.round(current.current.temp_c)}°C</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">{translate('humidity')}</p>
                <p className="font-medium">{current.current.humidity}%</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Wind className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                <p className="text-sm text-muted-foreground">{translate('windSpeed')}</p>
                <p className="font-medium">{Math.round(current.current.wind_kph)} km/h</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <CloudRain className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-muted-foreground">{translate('condition')}</p>
                <p className="font-medium text-sm">{current.current.condition.text}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm text-muted-foreground">{translate('visibility')}</p>
                <p className="font-medium">{Math.round(current.current.vis_km)} km</p>
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
            {translate('forecast')}
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
              {translate('weatherAlertsTitle')}
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
              {translate('pestAlerts')}
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