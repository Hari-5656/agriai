import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { useLanguage } from './language-provider'
import { Wheat, MapPin, Calendar, Droplets, Thermometer, TrendingUp } from 'lucide-react'

export function CropRecommendation() {
  const { translate } = useLanguage()
  const [formData, setFormData] = useState({
    location: '',
    soilType: '',
    season: '',
    waterAvailability: '',
    farmSize: '',
    budget: ''
  })
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockRecommendations = [
        {
          crop: 'Wheat',
          suitability: 95,
          expectedYield: '3.2 tons/hectare',
          profitability: 'High',
          waterRequirement: 'Medium',
          duration: '120-150 days',
          reasons: [
            'Perfect soil conditions',
            'Optimal temperature range',
            'Good market demand',
            'Low pest risk in your area'
          ],
          tips: [
            'Plant during November-December',
            'Use certified seeds',
            'Apply balanced fertilizer',
            'Monitor for rust disease'
          ]
        },
        {
          crop: 'Mustard',
          suitability: 88,
          expectedYield: '1.8 tons/hectare',
          profitability: 'Medium',
          waterRequirement: 'Low',
          duration: '90-110 days',
          reasons: [
            'Low water requirement',
            'Good soil pH match',
            'Short growing season',
            'Suitable for winter crop'
          ],
          tips: [
            'Sow in October',
            'Use 3-4 kg seeds per hectare',
            'Light irrigation required',
            'Harvest when pods turn golden'
          ]
        },
        {
          crop: 'Chickpea',
          suitability: 82,
          expectedYield: '2.1 tons/hectare',
          profitability: 'High',
          waterRequirement: 'Low',
          duration: '100-120 days',
          reasons: [
            'Nitrogen fixation benefit',
            'Drought tolerant',
            'Good market price',
            'Improves soil fertility'
          ],
          tips: [
            'Plant after rice harvest',
            'Use rhizobium inoculation',
            'Minimal fertilizer needed',
            'Control pod borer'
          ]
        }
      ]
      setRecommendations(mockRecommendations)
      setIsLoading(false)
    }, 2000)
  }

  const getSuitabilityColor = (score: number) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-2">{translate('cropRecommendation')}</h1>
        <p className="text-muted-foreground">
          Get AI-powered crop recommendations based on your farm conditions and local climate
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Farm Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="location">Location/State</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                  placeholder="e.g., Punjab, Haryana"
                />
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
                <Label htmlFor="season">Season</Label>
                <Select 
                  value={formData.season}
                  onValueChange={(value) => setFormData(prev => ({...prev, season: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kharif">Kharif (June-October)</SelectItem>
                    <SelectItem value="rabi">Rabi (November-April)</SelectItem>
                    <SelectItem value="zaid">Zaid (April-June)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="waterAvailability">Water Availability</Label>
                <Select 
                  value={formData.waterAvailability}
                  onValueChange={(value) => setFormData(prev => ({...prev, waterAvailability: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select water source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="irrigated">Irrigated</SelectItem>
                    <SelectItem value="rainfed">Rainfed</SelectItem>
                    <SelectItem value="limited">Limited Irrigation</SelectItem>
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

              <div>
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({...prev, budget: e.target.value}))}
                  placeholder="e.g., 50000"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Get Recommendations'}
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
                  <Wheat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Fill in your farm details to get personalized crop recommendations
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
                    Analyzing your farm conditions and generating recommendations...
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
                      <Wheat className="h-5 w-5" />
                      {rec.crop}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recommended for your farm conditions
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">Suitability</span>
                      <div className={`w-3 h-3 rounded-full ${getSuitabilityColor(rec.suitability)}`}></div>
                    </div>
                    <span className="text-lg font-bold">{rec.suitability}%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <p className="text-xs text-muted-foreground">Expected Yield</p>
                    <p className="font-medium text-sm">{rec.expectedYield}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Badge variant="secondary" className="mb-1">{rec.profitability}</Badge>
                    <p className="text-xs text-muted-foreground">Profitability</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                    <p className="text-xs text-muted-foreground">Water Need</p>
                    <p className="font-medium text-sm">{rec.waterRequirement}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium text-sm">{rec.duration}</p>
                  </div>
                </div>

                {/* Reasons */}
                <div>
                  <h4 className="font-medium mb-2">Why this crop is suitable:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {rec.reasons.map((reason: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="font-medium mb-2">Farming Tips:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {rec.tips.map((tip: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}