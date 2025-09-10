import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useLanguage } from './language-provider'
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  DollarSign,
  MapPin,
  Calendar,
  BarChart3,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Eye,
  Bell
} from 'lucide-react'

interface MarketPrice {
  id: string
  crop: string
  variety: string
  currentPrice: number
  previousPrice: number
  change: number
  changePercent: number
  market: string
  location: string
  date: string
  volume: number
  unit: string
  grade: 'A' | 'B' | 'C'
}

interface PriceForecast {
  crop: string
  currentPrice: number
  predictedPrice: number
  confidence: number
  timeframe: string
  factors: string[]
}

export function MarketPrices() {
  const { translate } = useLanguage()
  const [selectedCrop, setSelectedCrop] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('week')

  const marketPrices: MarketPrice[] = [
    {
      id: '1',
      crop: 'Wheat',
      variety: 'PBW 343',
      currentPrice: 2250,
      previousPrice: 2180,
      change: 70,
      changePercent: 3.21,
      market: 'Punjab State Agricultural Marketing Board',
      location: 'Ludhiana',
      date: '2025-01-10',
      volume: 1250,
      unit: '₹/quintal',
      grade: 'A'
    },
    {
      id: '2',
      crop: 'Rice',
      variety: 'Basmati 1121',
      currentPrice: 5480,
      previousPrice: 5650,
      change: -170,
      changePercent: -3.01,
      market: 'New Delhi Agricultural Produce Market',
      location: 'Delhi',
      date: '2025-01-10',
      volume: 850,
      unit: '₹/quintal',
      grade: 'A'
    },
    {
      id: '3',
      crop: 'Cotton',
      variety: 'Bt Cotton',
      currentPrice: 6750,
      previousPrice: 6580,
      change: 170,
      changePercent: 2.58,
      market: 'Cotton Corporation of India',
      location: 'Gujarat',
      date: '2025-01-10',
      volume: 2100,
      unit: '₹/quintal',
      grade: 'A'
    },
    {
      id: '4',
      crop: 'Sugarcane',
      variety: 'Co 86032',
      currentPrice: 385,
      previousPrice: 380,
      change: 5,
      changePercent: 1.32,
      market: 'Local Sugar Mill',
      location: 'Uttar Pradesh',
      date: '2025-01-10',
      volume: 5600,
      unit: '₹/quintal',
      grade: 'B'
    },
    {
      id: '5',
      crop: 'Corn',
      variety: 'Yellow Maize',
      currentPrice: 1950,
      previousPrice: 1920,
      change: 30,
      changePercent: 1.56,
      market: 'Karnataka State Agricultural Marketing',
      location: 'Bangalore',
      date: '2025-01-10',
      volume: 980,
      unit: '₹/quintal',
      grade: 'A'
    },
    {
      id: '6',
      crop: 'Soybean',
      variety: 'JS 335',
      currentPrice: 4820,
      previousPrice: 4950,
      change: -130,
      changePercent: -2.63,
      market: 'Madhya Pradesh Mandi Board',
      location: 'Indore',
      date: '2025-01-10',
      volume: 1340,
      unit: '₹/quintal',
      grade: 'A'
    }
  ]

  const priceForecast: PriceForecast[] = [
    {
      crop: 'Wheat',
      currentPrice: 2250,
      predictedPrice: 2380,
      confidence: 85,
      timeframe: 'Next 30 days',
      factors: [
        'Government procurement increase',
        'Export demand rising',
        'Reduced supply from major states',
        'Monsoon impact on quality'
      ]
    },
    {
      crop: 'Rice',
      currentPrice: 5480,
      predictedPrice: 5200,
      confidence: 78,
      timeframe: 'Next 30 days',
      factors: [
        'Increased harvest arrival',
        'Export restrictions possible',
        'Good quality harvest',
        'Storage facility availability'
      ]
    },
    {
      crop: 'Cotton',
      currentPrice: 6750,
      predictedPrice: 7100,
      confidence: 82,
      timeframe: 'Next 30 days',
      factors: [
        'Global demand increase',
        'Textile industry growth',
        'Reduced production estimates',
        'International price trends'
      ]
    }
  ]

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800'
      case 'B': return 'bg-yellow-100 text-yellow-800'
      case 'C': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPrices = marketPrices.filter(price => {
    const cropMatch = selectedCrop === 'all' || price.crop.toLowerCase() === selectedCrop.toLowerCase()
    const locationMatch = selectedLocation === 'all' || price.location.toLowerCase().includes(selectedLocation.toLowerCase())
    return cropMatch && locationMatch
  })

  const avgPriceChange = marketPrices.reduce((sum, price) => sum + price.changePercent, 0) / marketPrices.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-2">{translate('marketPrices')}</h1>
        <p className="text-muted-foreground">
          Real-time market prices, trends, and forecasts for agricultural commodities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Price Change</p>
                <p className={`text-xl font-semibold ${getTrendColor(avgPriceChange)}`}>
                  {avgPriceChange > 0 ? '+' : ''}{avgPriceChange.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Markets</p>
                <p className="text-xl font-semibold">{new Set(marketPrices.map(p => p.location)).size}</p>
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
                <p className="text-sm text-muted-foreground">Highest Gainer</p>
                <p className="text-xl font-semibold">Wheat</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-xl font-semibold">12.1k</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current Prices</TabsTrigger>
          <TabsTrigger value="forecast">Price Forecast</TabsTrigger>
          <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-48">
                  <Label htmlFor="crop-filter">Filter by Crop</Label>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Crops</SelectItem>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="sugarcane">Sugarcane</SelectItem>
                      <SelectItem value="corn">Corn</SelectItem>
                      <SelectItem value="soybean">Soybean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-48">
                  <Label htmlFor="location-filter">Filter by Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="punjab">Punjab</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="uttar pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="madhya pradesh">Madhya Pradesh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Live Market Prices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPrices.map((price) => (
                  <div key={price.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-lg">{price.crop}</h4>
                        <p className="text-sm text-muted-foreground">{price.variety}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{price.currentPrice}</p>
                        <p className="text-sm text-muted-foreground">{price.unit}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Change</p>
                        <div className={`flex items-center justify-center gap-1 ${getTrendColor(price.change)}`}>
                          {getTrendIcon(price.change)}
                          <span className="font-medium">
                            {price.change > 0 ? '+' : ''}{price.change}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Change %</p>
                        <p className={`font-medium ${getTrendColor(price.changePercent)}`}>
                          {price.changePercent > 0 ? '+' : ''}{price.changePercent.toFixed(2)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Volume</p>
                        <p className="font-medium">{price.volume} quintals</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Grade</p>
                        <Badge className={getGradeColor(price.grade)}>
                          Grade {price.grade}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium text-sm">{price.location}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium text-sm">
                          {new Date(price.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{price.market}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          View Chart
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bell className="h-4 w-4 mr-1" />
                          Set Alert
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Price Forecast & Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {priceForecast.map((forecast, index) => (
                  <div key={index} className="border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold">{forecast.crop}</h4>
                        <p className="text-sm text-muted-foreground">{forecast.timeframe}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {forecast.confidence}% Confidence
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                        <p className="text-2xl font-bold">₹{forecast.currentPrice}</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Predicted Price</p>
                        <p className={`text-2xl font-bold ${
                          forecast.predictedPrice > forecast.currentPrice ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ₹{forecast.predictedPrice}
                        </p>
                        <p className={`text-sm ${
                          forecast.predictedPrice > forecast.currentPrice ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {forecast.predictedPrice > forecast.currentPrice ? '+' : ''}
                          {((forecast.predictedPrice - forecast.currentPrice) / forecast.currentPrice * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-3">Key Factors Influencing Price:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {forecast.factors.map((factor, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Trends Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-900">Bullish Trends</h4>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Wheat prices showing upward momentum</li>
                      <li>• Cotton demand increasing globally</li>
                      <li>• Export opportunities expanding</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <h4 className="font-medium text-red-900">Bearish Trends</h4>
                    </div>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Rice prices under pressure</li>
                      <li>• Soybean market facing headwinds</li>
                      <li>• Increased supply affecting prices</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">Best Time to Sell</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Wheat and Cotton showing positive trends
                    </p>
                    <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                  </div>
                  
                  <div className="p-4 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-medium">Hold Strategy</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Monitor Corn and Sugarcane for better opportunities
                    </p>
                    <Badge className="bg-yellow-100 text-yellow-800">Wait</Badge>
                  </div>
                  
                  <div className="p-4 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <h4 className="font-medium">Consider Alternatives</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Rice and Soybean prices may decline further
                    </p>
                    <Badge className="bg-red-100 text-red-800">Caution</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Set Price Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="alert-crop">Crop</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="alert-price">Target Price (₹)</Label>
                  <Input placeholder="e.g., 2500" />
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Price Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Wheat - Above ₹2300</p>
                    <p className="text-sm text-muted-foreground">Current: ₹2250 | Target: ₹2300</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Cotton - Below ₹6500</p>
                    <p className="text-sm text-muted-foreground">Current: ₹6750 | Target: ₹6500</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Monitoring</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}