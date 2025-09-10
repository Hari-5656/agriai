import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useLanguage } from './language-provider'
import { 
  Sprout, 
  Leaf, 
  Beaker, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calculator
} from 'lucide-react'

interface FertilizerRecommendation {
  type: string
  name: string
  npkRatio: string
  dosage: string
  applicationTime: string
  frequency: string
  method: string
  cost: string
  benefits: string[]
  precautions: string[]
}

export function FertilizerGuide() {
  const { translate } = useLanguage()
  const [formData, setFormData] = useState({
    crop: '',
    soilType: '',
    cropStage: '',
    farmSize: '',
    soilTestResults: {
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      ph: '',
      organicMatter: ''
    }
  })
  const [recommendations, setRecommendations] = useState<FertilizerRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockRecommendations: FertilizerRecommendation[] = [
        {
          type: 'Primary',
          name: 'NPK Complex (12:32:16)',
          npkRatio: '12:32:16',
          dosage: '125 kg/hectare',
          applicationTime: 'At sowing time',
          frequency: 'One time application',
          method: 'Broadcast and incorporate',
          cost: '₹2,500/hectare',
          benefits: [
            'Balanced nutrient supply',
            'Improves root development',
            'Enhances flowering',
            'Increases yield by 15-20%'
          ],
          precautions: [
            'Apply in moist soil',
            'Avoid application during hot weather',
            'Mix well with soil',
            'Keep away from seeds'
          ]
        },
        {
          type: 'Secondary',
          name: 'Urea (46% N)',
          npkRatio: '46:0:0',
          dosage: '65 kg/hectare',
          applicationTime: '30 days after sowing',
          frequency: 'Split application (2 doses)',
          method: 'Top dressing',
          cost: '₹1,200/hectare',
          benefits: [
            'Quick nitrogen supply',
            'Promotes vegetative growth',
            'Improves protein content',
            'Fast acting fertilizer'
          ],
          precautions: [
            'Apply before irrigation',
            'Do not touch leaves directly',
            'Apply in evening hours',
            'Ensure soil moisture'
          ]
        },
        {
          type: 'Organic',
          name: 'Vermicompost + Bio-fertilizer',
          npkRatio: '1.5:1.0:1.5',
          dosage: '2.5 tons/hectare',
          applicationTime: '15 days before sowing',
          frequency: 'Once per season',
          method: 'Broadcast and mix',
          cost: '₹3,000/hectare',
          benefits: [
            'Improves soil structure',
            'Increases water retention',
            'Enhances microbial activity',
            'Long-term soil health'
          ],
          precautions: [
            'Ensure proper decomposition',
            'Apply when soil is moist',
            'Mix thoroughly with soil',
            'Store in dry place'
          ]
        }
      ]
      
      setRecommendations(mockRecommendations)
      setIsLoading(false)
    }, 2000)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Primary': return 'bg-blue-100 text-blue-800'
      case 'Secondary': return 'bg-green-100 text-green-800'
      case 'Organic': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const fertilizerKnowledge = [
    {
      category: 'Nitrogen (N)',
      importance: 'Essential for vegetative growth and chlorophyll formation',
      symptoms: 'Yellowing of older leaves, stunted growth',
      sources: 'Urea, Ammonium Sulfate, CAN'
    },
    {
      category: 'Phosphorus (P)',
      importance: 'Root development, flowering, and fruit formation',
      symptoms: 'Purple/red discoloration, delayed maturity',
      sources: 'DAP, SSP, NPK complexes'
    },
    {
      category: 'Potassium (K)',
      importance: 'Disease resistance, water regulation, quality improvement',
      symptoms: 'Leaf edge burning, weak stems',
      sources: 'MOP, SOP, NPK complexes'
    }
  ]

  const applicationSchedule = [
    { stage: 'Pre-sowing', fertilizers: ['Organic manure', 'Phosphorus fertilizer'], timing: '15-20 days before sowing' },
    { stage: 'At sowing', fertilizers: ['NPK complex', 'Starter fertilizer'], timing: 'During seed placement' },
    { stage: 'Vegetative', fertilizers: ['Nitrogen fertilizer', 'Foliar spray'], timing: '30-45 days after sowing' },
    { stage: 'Flowering', fertilizers: ['Potash fertilizer', 'Micronutrients'], timing: 'At flower initiation' },
    { stage: 'Fruit development', fertilizers: ['Balanced NPK', 'Calcium spray'], timing: 'During fruit development' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-2">{translate('fertilizerGuide')}</h1>
        <p className="text-muted-foreground">
          Get personalized fertilizer recommendations based on your crop, soil conditions, and growth stage
        </p>
      </div>

      <Tabs defaultValue="recommendation" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recommendation">Get Recommendations</TabsTrigger>
          <TabsTrigger value="knowledge">Fertilizer Knowledge</TabsTrigger>
          <TabsTrigger value="schedule">Application Schedule</TabsTrigger>
          <TabsTrigger value="calculator">Dosage Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Crop & Soil Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="crop">Crop Type</Label>
                    <Select 
                      value={formData.crop}
                      onValueChange={(value) => setFormData(prev => ({...prev, crop: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="potato">Potato</SelectItem>
                        <SelectItem value="tomato">Tomato</SelectItem>
                        <SelectItem value="onion">Onion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select 
                      value={formData.soilType}
                      onValueChange={(value) => setFormData(prev => ({...prev, soilType: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="loam">Loam</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="silt">Silt</SelectItem>
                        <SelectItem value="black">Black Cotton</SelectItem>
                        <SelectItem value="red">Red Soil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="cropStage">Current Crop Stage</Label>
                    <Select 
                      value={formData.cropStage}
                      onValueChange={(value) => setFormData(prev => ({...prev, cropStage: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-sowing">Pre-sowing</SelectItem>
                        <SelectItem value="germination">Germination</SelectItem>
                        <SelectItem value="vegetative">Vegetative</SelectItem>
                        <SelectItem value="flowering">Flowering</SelectItem>
                        <SelectItem value="fruiting">Fruiting</SelectItem>
                        <SelectItem value="maturity">Maturity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                    <Input
                      id="farmSize"
                      type="number"
                      value={formData.farmSize}
                      onChange={(e) => setFormData(prev => ({...prev, farmSize: e.target.value}))}
                      placeholder="e.g., 2.5"
                    />
                  </div>

                  {/* Soil Test Results */}
                  <div className="space-y-3">
                    <Label>Soil Test Results (Optional)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="N (%)"
                        value={formData.soilTestResults.nitrogen}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          soilTestResults: {...prev.soilTestResults, nitrogen: e.target.value}
                        }))}
                      />
                      <Input
                        placeholder="P (%)"
                        value={formData.soilTestResults.phosphorus}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          soilTestResults: {...prev.soilTestResults, phosphorus: e.target.value}
                        }))}
                      />
                      <Input
                        placeholder="K (%)"
                        value={formData.soilTestResults.potassium}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          soilTestResults: {...prev.soilTestResults, potassium: e.target.value}
                        }))}
                      />
                      <Input
                        placeholder="pH"
                        value={formData.soilTestResults.ph}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          soilTestResults: {...prev.soilTestResults, ph: e.target.value}
                        }))}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Analyzing...' : 'Get Fertilizer Recommendations'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="lg:col-span-2 space-y-4">
              {recommendations.length === 0 && !isLoading && (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Fill in your crop and soil details to get personalized fertilizer recommendations
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isLoading && (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">
                        Analyzing soil conditions and generating fertilizer recommendations...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Beaker className="h-5 w-5" />
                          {rec.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          NPK Ratio: {rec.npkRatio}
                        </p>
                      </div>
                      <Badge className={getTypeColor(rec.type)}>
                        {rec.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Application Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <Calculator className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                        <p className="text-xs text-muted-foreground">Dosage</p>
                        <p className="font-medium text-sm">{rec.dosage}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <Calendar className="h-4 w-4 mx-auto mb-1 text-green-600" />
                        <p className="text-xs text-muted-foreground">Timing</p>
                        <p className="font-medium text-sm">{rec.applicationTime}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <Sprout className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                        <p className="text-xs text-muted-foreground">Method</p>
                        <p className="font-medium text-sm">{rec.method}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <TrendingUp className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                        <p className="text-xs text-muted-foreground">Cost</p>
                        <p className="font-medium text-sm">{rec.cost}</p>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Benefits
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {rec.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Precautions */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        Precautions
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {rec.precautions.map((precaution, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            {precaution}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fertilizerKnowledge.map((nutrient, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    {nutrient.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Importance</h4>
                    <p className="text-sm text-muted-foreground">{nutrient.importance}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Deficiency Symptoms</h4>
                    <p className="text-sm text-muted-foreground">{nutrient.symptoms}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Common Sources</h4>
                    <p className="text-sm text-muted-foreground">{nutrient.sources}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fertilizer Application Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationSchedule.map((stage, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{stage.stage}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{stage.timing}</p>
                      <div className="flex flex-wrap gap-2">
                        {stage.fertilizers.map((fertilizer, i) => (
                          <Badge key={i} variant="secondary">{fertilizer}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Fertilizer Dosage Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Calculator feature will be available soon. This will help you calculate exact fertilizer quantities based on your farm size and soil test results.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}