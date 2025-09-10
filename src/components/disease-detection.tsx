import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { useLanguage } from './language-provider'
import { 
  Upload, 
  Camera, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Leaf,
  Eye,
  Shield,
  Zap
} from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface DetectionResult {
  disease: string
  confidence: number
  severity: 'Low' | 'Medium' | 'High'
  description: string
  symptoms: string[]
  causes: string[]
  treatment: string[]
  prevention: string[]
}

export function DiseaseDetection() {
  const { translate } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = () => {
    if (!selectedImage) return
    
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults: DetectionResult[] = [
        {
          disease: 'Leaf Rust',
          confidence: 92,
          severity: 'Medium',
          description: 'Fungal disease affecting wheat and other cereal crops, characterized by orange-red pustules on leaves.',
          symptoms: [
            'Orange-red pustules on leaf surface',
            'Yellow spots around pustules',
            'Premature leaf senescence',
            'Reduced grain quality'
          ],
          causes: [
            'High humidity (60-80%)',
            'Temperature range 15-25°C',
            'Dense crop canopy',
            'Poor air circulation'
          ],
          treatment: [
            'Apply fungicide (Propiconazole)',
            'Remove infected plant debris',
            'Improve field drainage',
            'Use resistant varieties'
          ],
          prevention: [
            'Crop rotation with non-host crops',
            'Plant resistant varieties',
            'Proper field sanitation',
            'Balanced fertilization'
          ]
        },
        {
          disease: 'Healthy Plant',
          confidence: 88,
          severity: 'Low',
          description: 'Plant appears healthy with no visible signs of disease or pest damage.',
          symptoms: [
            'Green healthy foliage',
            'No spots or discoloration',
            'Normal growth pattern',
            'Good vigor'
          ],
          causes: [
            'Optimal growing conditions',
            'Good nutrition',
            'Proper water management',
            'Disease-free environment'
          ],
          treatment: [
            'Continue current care practices',
            'Monitor regularly for changes',
            'Maintain nutrition schedule',
            'Keep optimal growing conditions'
          ],
          prevention: [
            'Regular monitoring',
            'Preventive spraying if needed',
            'Maintain plant hygiene',
            'Proper nutrition'
          ]
        }
      ]
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setResult(randomResult)
      setIsAnalyzing(false)
    }, 3000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'High': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Low': return <CheckCircle className="h-4 w-4" />
      case 'Medium': return <AlertTriangle className="h-4 w-4" />
      case 'High': return <AlertTriangle className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-2">{translate('diseaseDetection')}</h1>
        <p className="text-muted-foreground">
          Upload a photo of your plant to detect diseases and get treatment recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {translate('uploadImage')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Area */}
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <div className="space-y-4">
                  <img 
                    src={selectedImage} 
                    alt="Uploaded plant" 
                    className="max-w-full max-h-64 mx-auto rounded-lg object-cover"
                  />
                  <Button 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Click to upload plant image</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports JPG, PNG files up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Tips */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Photography Tips:</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Take clear, well-lit photos</p>
                <p>• Focus on affected plant parts</p>
                <p>• Include multiple symptoms if present</p>
                <p>• Avoid blurry or low-quality images</p>
              </div>
            </div>

            {/* Analyze Button */}
            <Button 
              onClick={analyzeImage} 
              disabled={!selectedImage || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Plant Health
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result && !isAnalyzing && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Upload an image to start disease detection analysis
                  </p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <div>
                    <p className="font-medium">Analyzing plant image...</p>
                    <p className="text-sm text-muted-foreground">
                      Using AI to detect diseases and health issues
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Progress value={33} className="w-48 mx-auto" />
                    <p className="text-xs text-muted-foreground">Processing image...</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Main Result */}
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">{result.disease}</h3>
                  <div className="flex items-center justify-center gap-4 mb-3">
                    <Badge className={getSeverityColor(result.severity)}>
                      {getSeverityIcon(result.severity)}
                      <span className="ml-1">{result.severity} Risk</span>
                    </Badge>
                    <Badge variant="outline">
                      {result.confidence}% Confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                </div>

                {/* Detailed Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Symptoms */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Symptoms
                    </h4>
                    <div className="space-y-1">
                      {result.symptoms.map((symptom, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          {symptom}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Causes */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Possible Causes
                    </h4>
                    <div className="space-y-1">
                      {result.causes.map((cause, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          {cause}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Treatment
                    </h4>
                    <div className="space-y-1">
                      {result.treatment.map((treatment, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          {treatment}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prevention */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Prevention
                    </h4>
                    <div className="space-y-1">
                      {result.prevention.map((prevention, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {prevention}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    Save Report
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Get Expert Help
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedImage(null)
                      setResult(null)
                    }}
                  >
                    Analyze New Image
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sample Images for Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Try Sample Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
              onClick={() => {
                setSelectedImage("https://images.unsplash.com/photo-1728297753604-d2e129bdb226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGRpc2Vhc2UlMjBsZWFmJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzU3NTA2NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral")
                setResult(null)
              }}
            >
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1728297753604-d2e129bdb226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGRpc2Vhc2UlMjBsZWFmJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzU3NTA2NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Diseased leaf sample"
                className="w-full h-24 object-cover"
              />
              <p className="text-xs p-2 text-center">Leaf Disease</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}