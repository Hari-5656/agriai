import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { Skeleton } from './ui/skeleton'
import { useLanguage } from './language-provider'
import { 
  governmentSchemesAPI, 
  GovernmentScheme, 
  SchemeApplication, 
  EligibilityCriteria,
  openOfficialWebsite,
  getSchemeStatusColor,
  getApplicationStatusColor
} from '../lib/government-schemes-api'
import { 
  FileText, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Download,
  Filter,
  Search,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  Shield,
  Banknote,
  Tractor,
  Droplets,
  Loader2,
  RefreshCw,
  Globe,
  Info
} from 'lucide-react'

// Remove duplicate interfaces as they're now imported from the API service

export function GovernmentSchemes() {
  const { translate } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedState, setSelectedState] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([])
  const [applications, setApplications] = useState<SchemeApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [eligibilityResults, setEligibilityResults] = useState<GovernmentScheme[]>([])
  const [eligibilityLoading, setEligibilityLoading] = useState(false)

  // Load schemes and applications on component mount
  useEffect(() => {
    loadSchemes()
    loadApplications()
  }, [])

  // Load schemes from API
  const loadSchemes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await governmentSchemesAPI.getAllSchemes()
      setSchemes(data)
    } catch (err) {
      setError('Failed to load government schemes. Please try again.')
      console.error('Error loading schemes:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load user applications from API
  const loadApplications = async () => {
    try {
      // In a real app, you'd get the user ID from authentication context
      const userId = 'current-user-id'
      const data = await governmentSchemesAPI.getUserApplications(userId)
      setApplications(data)
    } catch (err) {
      console.error('Error loading applications:', err)
    }
  }

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([loadSchemes(), loadApplications()])
    setRefreshing(false)
  }

  // Handle official website visit
  const handleVisitWebsite = (url: string) => {
    openOfficialWebsite(url)
  }

  // Handle eligibility check
  const handleEligibilityCheck = async (criteria: EligibilityCriteria) => {
    try {
      setEligibilityLoading(true)
      const results = await governmentSchemesAPI.checkEligibility(criteria)
      setEligibilityResults(results)
    } catch (err) {
      console.error('Error checking eligibility:', err)
    } finally {
      setEligibilityLoading(false)
    }
  }

  // Use imported utility functions
  const getStatusColor = getSchemeStatusColor
  const getApplicationStatusColorFunc = getApplicationStatusColor

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'subsidy': return <DollarSign className="h-5 w-5 text-green-600" />
      case 'insurance': return <Shield className="h-5 w-5 text-blue-600" />
      case 'loan': return <Banknote className="h-5 w-5 text-purple-600" />
      case 'welfare': return <Users className="h-5 w-5 text-orange-600" />
      case 'training': return <FileText className="h-5 w-5 text-cyan-600" />
      case 'technology': return <Tractor className="h-5 w-5 text-indigo-600" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const filteredSchemes = schemes.filter(scheme => {
    const categoryMatch = selectedCategory === 'all' || scheme.category === selectedCategory
    const searchMatch = searchTerm === '' || 
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
  })

  // Loading skeleton component
  const SchemeSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5" />
            <div>
              <Skeleton className="h-6 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2">Government Schemes</h1>
          <p className="text-muted-foreground">
            Explore and apply for various government schemes and subsidies available for farmers
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="schemes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="schemes">Available Schemes</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility Checker</TabsTrigger>
          <TabsTrigger value="documents">Document Helper</TabsTrigger>
        </TabsList>

        <TabsContent value="schemes" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <Label htmlFor="search">Search Schemes</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="min-w-48">
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="subsidy">Subsidies</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="loan">Loans</SelectItem>
                      <SelectItem value="welfare">Welfare</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-48">
                  <Label htmlFor="state">State</Label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      <SelectItem value="punjab">Punjab</SelectItem>
                      <SelectItem value="haryana">Haryana</SelectItem>
                      <SelectItem value="up">Uttar Pradesh</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schemes List */}
          <div className="space-y-4">
            {loading ? (
              // Show loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <SchemeSkeleton key={index} />
              ))
            ) : filteredSchemes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No schemes found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredSchemes.map((scheme) => (
                <Card key={scheme.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getCategoryIcon(scheme.category)}
                      <div>
                        <CardTitle className="text-lg">{scheme.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {scheme.ministry}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(scheme.status)}>
                        {scheme.status}
                      </Badge>
                      {scheme.deadlineDate && (
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          <Calendar className="h-3 w-3 mr-1" />
                          Deadline: {new Date(scheme.deadlineDate).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{scheme.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Budget Allocation</h4>
                      <p className="text-sm">{scheme.budget}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Target Beneficiaries</h4>
                      <p className="text-sm">{scheme.targetBeneficiaries}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Category</h4>
                      <p className="text-sm capitalize">{scheme.category}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Key Benefits:</h4>
                      <ul className="text-sm space-y-1">
                        {scheme.benefits.slice(0, 3).map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Basic Eligibility:</h4>
                      <ul className="text-sm space-y-1">
                        {scheme.eligibility.slice(0, 3).map((criteria, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Users className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {scheme.website && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleVisitWebsite(scheme.website!)}
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        Official Website
                      </Button>
                    )}
                    {scheme.helpline && (
                      <Button 
                        variant="outline"
                        onClick={() => window.open(`tel:${scheme.helpline}`)}
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        {scheme.helpline}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Scheme Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <div className="text-center p-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No applications found</h3>
                    <p className="text-muted-foreground">
                      You haven't applied for any schemes yet
                    </p>
                  </div>
                ) : (
                  applications.map((application) => (
                  <div key={application.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{application.schemeName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Application #: {application.applicationNumber}
                        </p>
                      </div>
                      <Badge className={getApplicationStatusColorFunc(application.status)}>
                        {application.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Applied On</p>
                        <p className="font-medium text-sm">
                          {new Date(application.applicationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="font-medium text-sm">
                          {new Date(application.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium text-sm capitalize">
                          {application.status.replace('-', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <Progress 
                          value={
                            application.status === 'submitted' ? 25 :
                            application.status === 'under-review' ? 50 :
                            application.status === 'documents-required' ? 40 :
                            application.status === 'approved' ? 100 : 75
                          } 
                          className="h-2 mt-1"
                        />
                      </div>
                    </div>

                    {application.nextAction && (
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded text-sm mb-3">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">Next Action: {application.nextAction}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View Application
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      {application.status === 'documents-required' && (
                        <Button size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Upload Documents
                        </Button>
                      )}
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eligibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheme Eligibility Checker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="land-size">Land Size (in acres)</Label>
                    <Input id="land-size" placeholder="e.g., 2.5" />
                  </div>
                  <div>
                    <Label htmlFor="farmer-category">Farmer Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marginal">Marginal Farmer (&lt; 1 hectare)</SelectItem>
                        <SelectItem value="small">Small Farmer (1-2 hectares)</SelectItem>
                        <SelectItem value="medium">Medium Farmer (2-10 hectares)</SelectItem>
                        <SelectItem value="large">Large Farmer (&gt; 10 hectares)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="annual-income">Annual Income (₹)</Label>
                    <Input id="annual-income" placeholder="e.g., 200000" />
                  </div>
                  <div>
                    <Label htmlFor="crop-type">Primary Crop</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="pulses">Pulses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    const criteria: EligibilityCriteria = {
                      landSize: parseFloat((document.getElementById('land-size') as HTMLInputElement)?.value || '0'),
                      farmerCategory: (document.querySelector('[data-value]') as HTMLSelectElement)?.value as any,
                      annualIncome: parseFloat((document.getElementById('annual-income') as HTMLInputElement)?.value || '0'),
                      cropType: (document.querySelector('[data-value]') as HTMLSelectElement)?.value,
                      state: selectedState !== 'all' ? selectedState : undefined
                    }
                    handleEligibilityCheck(criteria)
                  }}
                  disabled={eligibilityLoading}
                >
                  {eligibilityLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Check Eligible Schemes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Results */}
          {eligibilityResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Eligible Schemes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eligibilityResults.map((scheme) => (
                    <div key={scheme.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          {getCategoryIcon(scheme.category)}
                          <div>
                            <h4 className="font-medium">{scheme.name}</h4>
                            <p className="text-sm text-muted-foreground">{scheme.ministry}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(scheme.status)}>
                          {scheme.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{scheme.description}</p>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Apply Now
                        </Button>
                        {scheme.website && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleVisitWebsite(scheme.website!)}
                          >
                            <Globe className="h-4 w-4 mr-1" />
                            Visit Website
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Documents Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Aadhaar Card</p>
                      <p className="text-sm text-muted-foreground">Required for most schemes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <Building className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Land Documents</p>
                      <p className="text-sm text-muted-foreground">Khata/Khatauni, Revenue Records</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <Banknote className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Bank Account Details</p>
                      <p className="text-sm text-muted-foreground">Passbook, IFSC Code</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <Phone className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Mobile Number</p>
                      <p className="text-sm text-muted-foreground">Linked with Aadhaar</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    PM-KISAN Application Form
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    PMFBY Insurance Form
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    KCC Application Form
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Income Certificate Format
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Caste Certificate Format
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Helpful Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-border rounded-lg">
                  <Phone className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">Kisan Call Center</p>
                  <p className="text-sm text-muted-foreground">1800-180-1551</p>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <Phone className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">PM-KISAN Helpline</p>
                  <p className="text-sm text-muted-foreground">011-24300677</p>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <Phone className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <p className="font-medium">PMFBY Helpline</p>
                  <p className="text-sm text-muted-foreground">14447</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}