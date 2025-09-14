import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { useLanguage } from './language-provider'
import { useAppData } from '../contexts/AppDataContext'
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Leaf,
  RefreshCw,
  Loader2,
  MapPin,
  Clock
} from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface Alert {
  type: 'warning' | 'info' | 'success'
  message: string
  time: string
}

export function Dashboard() {
  const { translate } = useLanguage()
  const { data, refreshAllData } = useAppData()

  // Add error boundary for data
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Generate alerts based on current data
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = []

    // Weather alerts
    if (data.weather?.current) {
      const temp = data.weather.current.current.temp_c
      if (temp > 40) {
        alerts.push({ 
          type: 'warning', 
          message: `High temperature alert: ${temp}°C - Protect crops from heat stress`, 
          time: 'Just now' 
        })
      } else if (temp < 5) {
        alerts.push({ 
          type: 'warning', 
          message: `Low temperature alert: ${temp}°C - Risk of frost damage`, 
          time: 'Just now' 
        })
      }

      if (data.weather.current.current.humidity < 30) {
        alerts.push({ 
          type: 'warning', 
          message: 'Low humidity detected - Consider irrigation', 
          time: 'Just now' 
        })
      }

      if (data.weather.current.current.wind_kph > 50) {
        alerts.push({ 
          type: 'warning', 
          message: `Strong winds: ${data.weather.current.current.wind_kph} km/h - Secure equipment`, 
          time: 'Just now' 
        })
      }
    }

    // Soil alerts
    if (data.soil?.ph && (data.soil.ph < 6.0 || data.soil.ph > 7.5)) {
      alerts.push({ 
        type: 'warning', 
        message: `Soil pH is ${data.soil.ph} - Consider soil amendment`, 
        time: 'Just now' 
      })
    }

    if (data.soil?.nitrogen && data.soil.nitrogen < 50) {
      alerts.push({ 
        type: 'info', 
        message: 'Low nitrogen levels - Consider fertilization', 
        time: 'Just now' 
      })
    }

    if (data.soil?.moisture) {
      if (data.soil.moisture < 40) {
        alerts.push({ 
          type: 'warning', 
          message: 'Low soil moisture - Irrigation recommended', 
          time: 'Just now' 
        })
      } else if (data.soil.moisture > 80) {
        alerts.push({ 
          type: 'info', 
          message: 'High soil moisture - Monitor for waterlogging', 
          time: 'Just now' 
        })
      }
    }

    // Water alerts
    if (data.water?.level && data.water.level < 50) {
      alerts.push({ 
        type: 'warning', 
        message: 'Low water level - Check water sources', 
        time: 'Just now' 
      })
    }

    if (data.water?.quality === 'poor') {
      alerts.push({ 
        type: 'warning', 
        message: 'Poor water quality detected - Test water parameters', 
        time: 'Just now' 
      })
    }

    // Crop health alerts
    if (data.cropHealth) {
      Object.entries(data.cropHealth).forEach(([crop, healthData]) => {
        if (crop !== 'loading' && crop !== 'error' && crop !== 'lastUpdated' && healthData && typeof healthData === 'object' && 'health' in healthData) {
          const cropHealth = healthData as { health: number; issues?: string[] }
          if (cropHealth.health < 60) {
            alerts.push({ 
              type: 'warning', 
              message: `${crop} health is ${cropHealth.health}% - ${cropHealth.issues?.join(', ') || 'Issues detected'}`, 
              time: 'Just now' 
            })
          }
        }
      })
    }

    // Market alerts
    if (data.market?.wheat?.trend === 'up' && data.market.wheat.price > 2500) {
      alerts.push({ 
        type: 'info', 
        message: `Wheat prices rising: ₹${data.market.wheat.price}/quintal - Good time to sell`, 
        time: 'Just now' 
      })
    }

    return alerts.slice(0, 5) // Show only top 5 alerts
  }

  const alerts = generateAlerts()

  // Get overall soil health status
  const getSoilHealthStatus = () => {
    const { ph, nitrogen, phosphorus, potassium, moisture } = data.soil || {}
    let score = 0
    
    // pH scoring (optimal range 6.0-7.5)
    if (ph && ph >= 6.0 && ph <= 7.5) score += 20
    else if (ph && ph >= 5.5 && ph <= 8.0) score += 15
    else score += 5
    
    // Nutrient scoring
    if (nitrogen && nitrogen >= 60) score += 20
    else if (nitrogen && nitrogen >= 40) score += 15
    else score += 5
    
    if (phosphorus && phosphorus >= 40) score += 20
    else if (phosphorus && phosphorus >= 25) score += 15
    else score += 5
    
    if (potassium && potassium >= 50) score += 20
    else if (potassium && potassium >= 30) score += 15
    else score += 5
    
    // Moisture scoring
    if (moisture && moisture >= 50 && moisture <= 80) score += 20
    else if (moisture && moisture >= 30 && moisture <= 90) score += 15
    else score += 5
    
    if (score >= 80) return { status: 'Excellent', color: 'text-green-600' }
    if (score >= 60) return { status: 'Good', color: 'text-blue-600' }
    if (score >= 40) return { status: 'Fair', color: 'text-yellow-600' }
    return { status: 'Poor', color: 'text-red-600' }
  }

  const soilHealth = getSoilHealthStatus()

  // Get market trend
  const getMarketTrend = () => {
    if (!data.market) return { trend: 'stable', percentage: 0 }
    
    const trends = Object.values(data.market).filter(item => 
      typeof item === 'object' && item && 'trend' in item
    ) as Array<{ trend: 'up' | 'down' | 'stable' }>
    
    const upCount = trends.filter(t => t.trend === 'up').length
    const downCount = trends.filter(t => t.trend === 'down').length
    
    if (upCount > downCount) return { trend: 'up', percentage: Math.round((upCount / trends.length) * 100) }
    if (downCount > upCount) return { trend: 'down', percentage: Math.round((downCount / trends.length) * 100) }
    return { trend: 'stable', percentage: 0 }
  }

  const marketTrend = getMarketTrend()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative rounded-lg overflow-hidden">
        <div className="w-full h-48 relative">
          <img 
            src="https://images.unsplash.com/photo-1594179131702-112ff2a880e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBhZ3JpY3VsdHVyZSUyMGZhcm1pbmclMjBmaWVsZHMlMjBjcm9wc3xlbnwxfHx8fDE3NTc1MDY2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Agricultural fields"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <div class="text-center text-white">
                      <h2 class="text-2xl font-bold mb-2">🌾 AgroSwayam</h2>
                      <p class="text-lg opacity-90">AI-Powered Agriculture Platform</p>
                    </div>
                  </div>
                `;
              }
            }}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-between px-6 z-20">
          <div className="text-center text-white flex-1">
            <h1 className="text-3xl mb-2">{translate('welcomeFarmer')}</h1>
            <p className="text-lg opacity-90">Your AI-powered farming companion</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            
          
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CloudRain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{translate('currentWeather')}</p>
                <p className="text-xl">
                  {data.weather?.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : data.weather?.current ? (
                    `${data.weather.current.current.temp_c}°C`
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{translate('soilHealth')}</p>
                <p className={`text-xl ${soilHealth.color}`}>
                  {data.soil?.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    soilHealth.status
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Droplets className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{translate('waterLevel')}</p>
                <p className="text-xl">
                  {data.water?.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    `${data.water?.level || 0}%`
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{translate('marketTrends')}</p>
                <p className="text-xl">
                  {data.market?.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {marketTrend.trend === 'up' && '↑'}
                      {marketTrend.trend === 'down' && '↓'}
                      {marketTrend.trend === 'stable' && '→'}
                      {marketTrend.percentage > 0 && `${marketTrend.percentage}%`}
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="h-5 w-5" />
              Weather Conditions
              {data.weather.current && (
                <span className="text-sm text-muted-foreground ml-auto">
                  {data.weather.current.location.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.weather?.loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading weather data...</span>
              </div>
            ) : data.weather?.current ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Temperature: {data.weather.current.current.temp_c}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Humidity: {data.weather.current.current.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Condition: {data.weather.current.current.condition.text}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Wind: {data.weather.current.current.wind_kph} km/h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Visibility: {data.weather.current.current.vis_km} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Updated: {data.weather.lastUpdated ? new Date(data.weather.lastUpdated).toLocaleTimeString() : 'N/A'}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CloudRain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No weather data available</p>
                <p className="text-sm">Check your location settings</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Soil Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Soil Analysis
              {data.soil.lastUpdated && (
                <span className="text-sm text-muted-foreground ml-auto">
                  Updated {new Date(data.soil.lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.soil?.loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading soil data...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">pH Level</span>
                    <span className="text-sm">{data.soil?.ph?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <Progress 
                    value={data.soil?.ph ? Math.min(100, Math.max(0, (data.soil.ph - 4) * 12.5)) : 0} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Nitrogen</span>
                    <span className="text-sm">{Math.round(data.soil?.nitrogen || 0)}%</span>
                  </div>
                  <Progress value={data.soil?.nitrogen || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Phosphorus</span>
                    <span className="text-sm">{Math.round(data.soil?.phosphorus || 0)}%</span>
                  </div>
                  <Progress value={data.soil?.phosphorus || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Potassium</span>
                    <span className="text-sm">{Math.round(data.soil?.potassium || 0)}%</span>
                  </div>
                  <Progress value={data.soil?.potassium || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Moisture</span>
                    <span className="text-sm">{Math.round(data.soil?.moisture || 0)}%</span>
                  </div>
                  <Progress value={data.soil?.moisture || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Temperature</span>
                    <span className="text-sm">{Math.round(data.soil?.temperature || 0)}°C</span>
                  </div>
                  <Progress 
                    value={data.soil?.temperature ? Math.min(100, Math.max(0, (data.soil.temperature - 10) * 3.33)) : 0} 
                    className="h-2" 
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />}
                  {alert.type === 'info' && <Activity className="h-4 w-4 text-blue-500 mt-0.5" />}
                  {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Crop Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Crop Health Status
              {data.cropHealth.lastUpdated && (
                <span className="text-sm text-muted-foreground ml-auto">
                  Updated {new Date(data.cropHealth.lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.cropHealth?.loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading crop health data...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {data.cropHealth && Object.entries(data.cropHealth).map(([crop, healthData]) => {
                  if (crop === 'loading' || crop === 'error' || crop === 'lastUpdated') return null
                  if (!healthData || typeof healthData !== 'object' || !('health' in healthData)) return null
                  
                  const cropHealth = healthData as { health: number; status?: string; issues?: string[] }
                  
                  return (
                    <div key={crop} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium capitalize">{crop}</p>
                        <p className="text-sm text-muted-foreground">{cropHealth.status || 'Unknown'}</p>
                        {cropHealth.issues && cropHealth.issues.length > 0 && (
                          <p className="text-xs text-orange-600 mt-1">
                            Issues: {cropHealth.issues.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{Math.round(cropHealth.health || 0)}%</p>
                        <Badge 
                          variant={(cropHealth.health || 0) >= 90 ? 'default' : (cropHealth.health || 0) >= 70 ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {cropHealth.status || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}