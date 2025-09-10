import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useLanguage } from './language-provider'
import { 
  Layers, 
  Beaker, 
  TrendingUp, 
  Droplets, 
  Thermometer,
  Activity,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Calendar
} from 'lucide-react'

interface SoilTest {
  id: string
  date: string
  location: string
  depth: string
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  organicMatter: number
  electricalConductivity: number
  moisture: number
  temperature: number
  recommendations: string[]
}

export function SoilData() {
  const { translate } = useLanguage()
  const [selectedTest, setSelectedTest] = useState<string>('current')

  const currentSoilData: SoilTest = {
    id: 'current',
    date: '2025-01-10',
    location: 'Field Block A, Punjab',
    depth: '0-20 cm',
    ph: 6.8,
    nitrogen: 0.78,
    phosphorus: 45,
    potassium: 280,
    organicMatter: 2.1,
    electricalConductivity: 0.45,
    moisture: 18.5,
    temperature: 16.2,
    recommendations: [
      'pH is optimal for most crops',
      'Nitrogen levels are good, maintain with organic matter',
      'Phosphorus is adequate',
      'Potassium levels are excellent',
      'Consider adding compost to increase organic matter'
    ]
  }

  const historicalData: SoilTest[] = [
    {
      id: 'test1',
      date: '2024-10-15',
      location: 'Field Block A, Punjab',
      depth: '0-20 cm',
      ph: 6.5,
      nitrogen: 0.65,
      phosphorus: 38,
      potassium: 245,
      organicMatter: 1.8,
      electricalConductivity: 0.52,
      moisture: 16.2,
      temperature: 18.5,
      recommendations: [
        'Consider lime application to raise pH',
        'Increase nitrogen through organic sources',
        'Phosphorus needs supplementation'
      ]
    },
    {
      id: 'test2',
      date: '2024-07-20',
      location: 'Field Block A, Punjab',
      depth: '0-20 cm',
      ph: 6.2,
      nitrogen: 0.58,
      phosphorus: 32,
      potassium: 220,
      organicMatter: 1.5,
      electricalConductivity: 0.58,
      moisture: 14.8,
      temperature: 22.1,
      recommendations: [
        'Apply lime to increase pH',
        'Add nitrogen-rich fertilizers',
        'Increase organic matter content'
      ]
    }
  ]

  const getStatusColor = (value: number, optimal: [number, number]) => {
    if (value >= optimal[0] && value <= optimal[1]) {
      return 'text-green-600'
    } else if (value < optimal[0] * 0.8 || value > optimal[1] * 1.2) {
      return 'text-red-600'
    } else {
      return 'text-yellow-600'
    }
  }

  const getStatusIcon = (value: number, optimal: [number, number]) => {
    if (value >= optimal[0] && value <= optimal[1]) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    } else if (value < optimal[0] * 0.8 || value > optimal[1] * 1.2) {
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    } else {
      return <Activity className="h-4 w-4 text-yellow-600" />
    }
  }

  const soilParameters = [
    {
      name: 'pH Level',
      value: currentSoilData.ph,
      optimal: [6.0, 7.5] as [number, number],
      unit: '',
      description: 'Soil acidity/alkalinity level',
      impact: 'Affects nutrient availability and microbial activity'
    },
    {
      name: 'Nitrogen',
      value: currentSoilData.nitrogen,
      optimal: [0.6, 1.0] as [number, number],
      unit: '%',
      description: 'Essential for plant growth and protein synthesis',
      impact: 'Critical for vegetative growth and chlorophyll formation'
    },
    {
      name: 'Phosphorus',
      value: currentSoilData.phosphorus,
      optimal: [40, 60] as [number, number],
      unit: 'ppm',
      description: 'Important for root development and flowering',
      impact: 'Essential for energy transfer and root development'
    },
    {
      name: 'Potassium',
      value: currentSoilData.potassium,
      optimal: [200, 300] as [number, number],
      unit: 'ppm',
      description: 'Enhances disease resistance and water regulation',
      impact: 'Improves stress tolerance and fruit quality'
    },
    {
      name: 'Organic Matter',
      value: currentSoilData.organicMatter,
      optimal: [2.0, 4.0] as [number, number],
      unit: '%',
      description: 'Improves soil structure and water retention',
      impact: 'Enhances soil fertility and microbial activity'
    },
    {
      name: 'Electrical Conductivity',
      value: currentSoilData.electricalConductivity,
      optimal: [0.2, 0.8] as [number, number],
      unit: 'dS/m',
      description: 'Indicates soil salinity level',
      impact: 'High levels can stress plants and reduce yields'
    }
  ]

  const environmentalFactors = [
    {
      name: 'Soil Moisture',
      value: currentSoilData.moisture,
      optimal: [15, 25] as [number, number],
      unit: '%',
      icon: <Droplets className="h-5 w-5 text-blue-500" />
    },
    {
      name: 'Soil Temperature',
      value: currentSoilData.temperature,
      optimal: [15, 25] as [number, number],
      unit: '°C',
      icon: <Thermometer className="h-5 w-5 text-red-500" />
    }
  ]

  const cropSuitability = [
    { crop: 'Wheat', suitability: 95, factors: 'Excellent pH, good nutrient levels' },
    { crop: 'Rice', suitability: 78, factors: 'Good overall, may need more moisture' },
    { crop: 'Corn', suitability: 88, factors: 'Good nitrogen levels, adequate phosphorus' },
    { crop: 'Cotton', suitability: 72, factors: 'Adequate levels, monitor salinity' },
    { crop: 'Sugarcane', suitability: 85, factors: 'Good nutrient profile' },
    { crop: 'Potato', suitability: 90, factors: 'Excellent conditions for tuber crops' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-2">{translate('soilData')}</h1>
        <p className="text-muted-foreground">
          Comprehensive soil analysis and monitoring for optimal crop production
        </p>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current Analysis</TabsTrigger>
          <TabsTrigger value="history">Historical Data</TabsTrigger>
          <TabsTrigger value="environmental">Environmental Factors</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Test Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Latest Soil Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm text-muted-foreground">Test Date</p>
                  <p className="font-medium">{new Date(currentSoilData.date).toLocaleDateString()}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-sm">{currentSoilData.location}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Layers className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm text-muted-foreground">Depth</p>
                  <p className="font-medium">{currentSoilData.depth}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Activity className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Good</Badge>
                </div>
              </div>

              {/* Soil Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {soilParameters.map((param, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(param.value, param.optimal)}
                        <h4 className="font-medium">{param.name}</h4>
                      </div>
                      <span className={`font-medium ${getStatusColor(param.value, param.optimal)}`}>
                        {param.value}{param.unit}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Optimal Range</span>
                          <span>{param.optimal[0]} - {param.optimal[1]}{param.unit}</span>
                        </div>
                        <Progress 
                          value={Math.min(100, (param.value / param.optimal[1]) * 100)} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{param.description}</p>
                        <p className="text-xs text-muted-foreground font-medium">
                          Impact: {param.impact}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Crop Suitability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Crop Suitability Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cropSuitability.map((crop, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{crop.crop}</h4>
                      <Badge 
                        className={
                          crop.suitability >= 90 ? 'bg-green-100 text-green-800' :
                          crop.suitability >= 75 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {crop.suitability}%
                      </Badge>
                    </div>
                    <Progress value={crop.suitability} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">{crop.factors}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Historical Soil Data Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {historicalData.map((test, index) => (
                  <div key={test.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Test #{historicalData.length - index}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(test.date).toLocaleDateString()} - {test.location}
                        </p>
                      </div>
                      <Badge variant="outline">{test.depth}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">pH</p>
                        <p className="font-medium">{test.ph}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">N (%)</p>
                        <p className="font-medium">{test.nitrogen}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">P (ppm)</p>
                        <p className="font-medium">{test.phosphorus}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">K (ppm)</p>
                        <p className="font-medium">{test.potassium}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">OM (%)</p>
                        <p className="font-medium">{test.organicMatter}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">EC (dS/m)</p>
                        <p className="font-medium">{test.electricalConductivity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {environmentalFactors.map((factor, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {factor.icon}
                    {factor.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold mb-2">
                        {factor.value}{factor.unit}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Optimal: {factor.optimal[0]} - {factor.optimal[1]}{factor.unit}
                      </p>
                    </div>
                    
                    <Progress 
                      value={Math.min(100, (factor.value / factor.optimal[1]) * 100)} 
                      className="h-3"
                    />
                    
                    <div className="flex items-center justify-center">
                      {getStatusIcon(factor.value, factor.optimal)}
                      <span className={`ml-2 font-medium ${getStatusColor(factor.value, factor.optimal)}`}>
                        {factor.value >= factor.optimal[0] && factor.value <= factor.optimal[1] ? 'Optimal' :
                         factor.value < factor.optimal[0] * 0.8 || factor.value > factor.optimal[1] * 1.2 ? 'Critical' : 'Moderate'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Environmental Monitoring Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Soil Moisture Management</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Monitor moisture levels regularly</li>
                    <li>• Adjust irrigation based on crop needs</li>
                    <li>• Use mulching to retain moisture</li>
                    <li>• Install soil moisture sensors</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Temperature Control</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use shade nets in extreme heat</li>
                    <li>• Apply mulch to regulate temperature</li>
                    <li>• Time irrigation to cool soil</li>
                    <li>• Monitor seasonal temperature patterns</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Soil Improvement Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSoilData.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request New Soil Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Schedule a comprehensive soil analysis to get updated recommendations for your fields
                </p>
                <Button>Schedule Soil Test</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}