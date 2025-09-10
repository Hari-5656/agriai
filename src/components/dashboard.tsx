import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { useLanguage } from './language-provider'
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Leaf
} from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

export function Dashboard() {
  const { translate } = useLanguage()

  const weatherData = {
    temperature: '28°C',
    humidity: '65%',
    rainfall: '2.5mm',
    windSpeed: '12 km/h'
  }

  const soilData = {
    ph: 6.8,
    nitrogen: 78,
    phosphorus: 45,
    potassium: 62
  }

  const alerts = [
    { type: 'warning', message: 'Heavy rain expected in next 48 hours', time: '2 hours ago' },
    { type: 'info', message: 'Optimal time for wheat sowing', time: '1 day ago' },
    { type: 'success', message: 'Soil moisture levels are optimal', time: '2 days ago' }
  ]

  const cropHealth = [
    { crop: 'Wheat', health: 92, status: 'Excellent' },
    { crop: 'Rice', health: 78, status: 'Good' },
    { crop: 'Corn', health: 85, status: 'Good' },
    { crop: 'Cotton', health: 67, status: 'Fair' }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative rounded-lg overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1594179131702-112ff2a880e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBhZ3JpY3VsdHVyZSUyMGZhcm1pbmclMjBmaWVsZHMlMjBjcm9wc3xlbnwxfHx8fDE3NTc1MDY2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Agricultural fields"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl mb-2">{translate('welcomeFarmer')}</h1>
            <p className="text-lg opacity-90">Your AI-powered farming companion</p>
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
                <p className="text-xl">{weatherData.temperature}</p>
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
                <p className="text-xl">Good</p>
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
                <p className="text-xl">78%</p>
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
                <p className="text-xl">↑ 12%</p>
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
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span className="text-sm">Temperature: {weatherData.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Humidity: {weatherData.humidity}</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Rainfall: {weatherData.rainfall}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm">Wind: {weatherData.windSpeed}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Soil Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Soil Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">pH Level</span>
                  <span className="text-sm">{soilData.ph}</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Nitrogen</span>
                  <span className="text-sm">{soilData.nitrogen}%</span>
                </div>
                <Progress value={soilData.nitrogen} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Phosphorus</span>
                  <span className="text-sm">{soilData.phosphorus}%</span>
                </div>
                <Progress value={soilData.phosphorus} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Potassium</span>
                  <span className="text-sm">{soilData.potassium}%</span>
                </div>
                <Progress value={soilData.potassium} className="h-2" />
              </div>
            </div>
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
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cropHealth.map((crop, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{crop.crop}</p>
                    <p className="text-sm text-muted-foreground">{crop.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{crop.health}%</p>
                    <Badge 
                      variant={crop.health >= 90 ? 'default' : crop.health >= 70 ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {crop.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}