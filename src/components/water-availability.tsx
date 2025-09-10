import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useLanguage } from './language-provider'
import { 
  Droplets, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Calendar,
  Gauge,
  Waves,
  Cloud,
  Eye
} from 'lucide-react'

interface WaterSource {
  id: string
  name: string
  type: 'groundwater' | 'surface' | 'rainwater' | 'canal'
  currentLevel: number
  capacity: number
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  lastUpdated: string
  trend: 'increasing' | 'stable' | 'decreasing'
}

interface IrrigationData {
  crop: string
  area: number
  waterRequirement: number
  currentUsage: number
  efficiency: number
  nextIrrigation: string
}

export function WaterAvailability() {
  const { translate } = useLanguage()
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('week')

  const waterSources: WaterSource[] = [
    {
      id: 'bore1',
      name: 'Bore Well #1',
      type: 'groundwater',
      currentLevel: 85,
      capacity: 100,
      quality: 'good',
      lastUpdated: '2025-01-10 14:30',
      trend: 'stable'
    },
    {
      id: 'bore2', 
      name: 'Bore Well #2',
      type: 'groundwater',
      currentLevel: 62,
      capacity: 100,
      quality: 'excellent',
      lastUpdated: '2025-01-10 14:25',
      trend: 'decreasing'
    },
    {
      id: 'canal1',
      name: 'Main Canal',
      type: 'canal',
      currentLevel: 78,
      capacity: 100,
      quality: 'fair',
      lastUpdated: '2025-01-10 12:00',
      trend: 'increasing'
    },
    {
      id: 'pond1',
      name: 'Farm Pond',
      type: 'surface',
      currentLevel: 45,
      capacity: 100,
      quality: 'good',
      lastUpdated: '2025-01-10 10:00',
      trend: 'stable'
    }
  ]

  const irrigationData: IrrigationData[] = [
    {
      crop: 'Wheat',
      area: 5.2,
      waterRequirement: 450,
      currentUsage: 320,
      efficiency: 78,
      nextIrrigation: '2025-01-12'
    },
    {
      crop: 'Rice',
      area: 3.8,
      waterRequirement: 680,
      currentUsage: 520,
      efficiency: 65,
      nextIrrigation: '2025-01-11'
    },
    {
      crop: 'Cotton',
      area: 2.5,
      waterRequirement: 380,
      currentUsage: 290,
      efficiency: 82,
      nextIrrigation: '2025-01-13'
    }
  ]

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'fair': return 'bg-yellow-100 text-yellow-800'
      case 'poor': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'groundwater': return <Droplets className="h-5 w-5 text-blue-600" />
      case 'surface': return <Waves className="h-5 w-5 text-cyan-600" />
      case 'canal': return <Activity className="h-5 w-5 text-green-600" />
      case 'rainwater': return <Cloud className="h-5 w-5 text-gray-600" />
      default: return <Droplets className="h-5 w-5" />
    }
  }

  const totalWaterAvailable = waterSources.reduce((total, source) => 
    total + (source.currentLevel * source.capacity / 100), 0
  )

  const totalCapacity = waterSources.reduce((total, source) => total + source.capacity, 0)
  const overallAvailability = Math.round((totalWaterAvailable / totalCapacity) * 100)

  const totalIrrigationNeed = irrigationData.reduce((total, crop) => total + crop.waterRequirement, 0)
  const totalCurrentUsage = irrigationData.reduce((total, crop) => total + crop.currentUsage, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-2">{translate('waterAvailability')}</h1>
        <p className="text-muted-foreground">
          Monitor water sources, track usage, and optimize irrigation scheduling
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Availability</p>
                <p className="text-xl font-semibold">{overallAvailability}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Gauge className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Sources</p>
                <p className="text-xl font-semibold">{waterSources.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Usage</p>
                <p className="text-xl font-semibold">{totalCurrentUsage}L</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Efficiency</p>
                <p className="text-xl font-semibold">75%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sources">Water Sources</TabsTrigger>
          <TabsTrigger value="irrigation">Irrigation Planning</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Water Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          {/* Water Sources */}
          <div className="flex items-center gap-4 mb-4">
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by source type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="groundwater">Groundwater</SelectItem>
                <SelectItem value="surface">Surface Water</SelectItem>
                <SelectItem value="canal">Canal Water</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              View on Map
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {waterSources.map((source) => (
              <Card key={source.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(source.type)}
                        {source.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground capitalize mt-1">
                        {source.type.replace(/([A-Z])/g, ' $1')} Source
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {getTrendIcon(source.trend)}
                        <span className="text-sm text-muted-foreground capitalize">{source.trend}</span>
                      </div>
                      <Badge className={getQualityColor(source.quality)}>
                        {source.quality}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Water Level */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Water Level</span>
                      <span className="text-sm font-medium">{source.currentLevel}%</span>
                    </div>
                    <Progress value={source.currentLevel} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Capacity: {source.capacity} units
                    </p>
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Last updated: {new Date(source.lastUpdated).toLocaleString()}</span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Monitor
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Activity className="h-4 w-4 mr-1" />
                      History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="irrigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Irrigation Schedule & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {irrigationData.map((crop, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{crop.crop}</h4>
                        <p className="text-sm text-muted-foreground">Area: {crop.area} hectares</p>
                      </div>
                      <Badge variant="outline">
                        Next: {new Date(crop.nextIrrigation).toLocaleDateString()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Required</p>
                        <p className="font-medium">{crop.waterRequirement}L</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Current Usage</p>
                        <p className="font-medium">{crop.currentUsage}L</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Efficiency</p>
                        <p className="font-medium">{crop.efficiency}%</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge 
                          className={crop.efficiency >= 80 ? 'bg-green-100 text-green-800' : 
                                   crop.efficiency >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                   'bg-red-100 text-red-800'}
                        >
                          {crop.efficiency >= 80 ? 'Optimal' : crop.efficiency >= 60 ? 'Good' : 'Poor'}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Water Usage Progress</span>
                        <span className="text-sm">{Math.round((crop.currentUsage / crop.waterRequirement) * 100)}%</span>
                      </div>
                      <Progress value={(crop.currentUsage / crop.waterRequirement) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="season">This Season</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Water Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-2">{totalCurrentUsage}L</p>
                  <p className="text-sm text-muted-foreground">This week</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">12% less than last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Irrigation Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600 mb-2">75%</p>
                  <p className="text-sm text-muted-foreground">Average efficiency</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">5% improvement</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600 mb-2">₹2,850</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">18% increase</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Optimize Irrigation Timing</p>
                    <p className="text-sm text-blue-700">Schedule irrigation during early morning or evening to reduce evaporation losses</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Install Drip Irrigation</p>
                    <p className="text-sm text-green-700">Consider drip irrigation for crops with low efficiency to improve water usage</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">Monitor Bore Well #2</p>
                    <p className="text-sm text-orange-700">Water level is decreasing. Consider alternative sources or reduced usage</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Water Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900">Low Water Level Warning</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Bore Well #2 water level has dropped below 65%. Consider reducing usage or switching to alternative sources.
                      </p>
                      <p className="text-xs text-red-600 mt-2">2 hours ago</p>
                    </div>
                  </div>
                </div>

                <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Irrigation Schedule Reminder</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Rice field irrigation is scheduled for tomorrow at 6:00 AM. Ensure adequate water supply.
                      </p>
                      <p className="text-xs text-yellow-600 mt-2">1 day ago</p>
                    </div>
                  </div>
                </div>

                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Water Quality Test Results</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Main Canal water quality test completed. Results show good quality suitable for irrigation.
                      </p>
                      <p className="text-xs text-blue-600 mt-2">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Low Water Level Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when water levels drop below threshold</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Irrigation Reminders</p>
                    <p className="text-sm text-muted-foreground">Receive reminders for scheduled irrigation</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Quality Alerts</p>
                    <p className="text-sm text-muted-foreground">Notifications about water quality changes</p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}