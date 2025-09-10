import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { useLanguage } from './language-provider'
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
  Droplets
} from 'lucide-react'

interface GovernmentScheme {
  id: string
  name: string
  category: 'subsidy' | 'insurance' | 'loan' | 'welfare' | 'training' | 'technology'
  description: string
  benefits: string[]
  eligibility: string[]
  documents: string[]
  applicationProcess: string[]
  deadlineDate?: string
  budget: string
  ministry: string
  status: 'active' | 'closed' | 'upcoming'
  targetBeneficiaries: string
  website?: string
  helpline?: string
}

interface Application {
  id: string
  schemeName: string
  applicationDate: string
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'documents-required'
  applicationNumber: string
  lastUpdated: string
  nextAction?: string
}

export function GovernmentSchemes() {
  const { translate } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedState, setSelectedState] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const governmentSchemes: GovernmentScheme[] = [
    {
      id: '1',
      name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      category: 'subsidy',
      description: 'Direct income support to farmers by providing ₹6,000 per year in three equal installments.',
      benefits: [
        '₹6,000 per year direct cash transfer',
        'No interest or processing charges',
        'Direct bank transfer every 4 months',
        'Covers all farmer families across India'
      ],
      eligibility: [
        'Small and marginal farmer families',
        'Own cultivable land',
        'Valid Aadhaar card required',
        'Bank account with Aadhaar linking'
      ],
      documents: [
        'Aadhaar Card',
        'Bank Account Details',
        'Land Ownership Documents',
        'Mobile Number'
      ],
      applicationProcess: [
        'Visit PM-KISAN portal or CSC center',
        'Fill registration form with required details',
        'Upload necessary documents',
        'Submit application and get registration number',
        'Track status online using registration number'
      ],
      budget: '₹87,217.50 crores (2024-25)',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      status: 'active',
      targetBeneficiaries: '11+ crore farmers',
      website: 'https://pmkisan.gov.in',
      helpline: '011-24300677'
    },
    {
      id: '2',
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      category: 'insurance',
      description: 'Crop insurance scheme providing financial support to farmers in case of crop failure due to natural calamities.',
      benefits: [
        'Low premium rates (1.5% for Rabi, 2% for Kharif)',
        'Coverage against natural calamities',
        'Use of technology for quick settlement',
        'No limit on government subsidy'
      ],
      eligibility: [
        'All farmers growing notified crops',
        'Compulsory for loanee farmers',
        'Voluntary for non-loanee farmers',
        'Coverage from sowing to post-harvest'
      ],
      documents: [
        'Aadhaar Card',
        'Bank Account Details',
        'Land Records (Khata/Khatauni)',
        'Sowing Certificate',
        'Loan Documents (if applicable)'
      ],
      applicationProcess: [
        'Apply through bank, CSC, or insurance company',
        'Submit application before cut-off date',
        'Pay premium amount',
        'Get policy document',
        'Report crop loss within 72 hours if occurred'
      ],
      deadlineDate: '2025-01-31',
      budget: '₹13,000 crores (2024-25)',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      status: 'active',
      targetBeneficiaries: '5.5 crore farmers',
      website: 'https://pmfby.gov.in',
      helpline: '14447'
    },
    {
      id: '3',
      name: 'Kisan Credit Card (KCC)',
      category: 'loan',
      description: 'Credit facility for farmers to meet their cultivation and other agriculture-related expenses.',
      benefits: [
        'Flexible credit limit based on cropping pattern',
        'Simple application process',
        'Crop insurance coverage',
        'ATM-cum-Debit card facility',
        'Interest subvention benefit'
      ],
      eligibility: [
        'Farmers (individual/joint) owner cultivators',
        'Tenant farmers and sharecroppers',
        'Self Help Group members',
        'Age: 18-75 years'
      ],
      documents: [
        'Application Form',
        'Identity Proof (Aadhaar/Voter ID)',
        'Address Proof',
        'Land Documents',
        'Income Certificate'
      ],
      applicationProcess: [
        'Visit nearest bank branch',
        'Fill KCC application form',
        'Submit required documents',
        'Bank verification and assessment',
        'Approval and card issuance'
      ],
      budget: '₹4 lakh crores credit target',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      status: 'active',
      targetBeneficiaries: '7+ crore farmers',
      website: 'https://www.nabard.org/kcc',
      helpline: '1800-180-1551'
    },
    {
      id: '4',
      name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
      category: 'technology',
      description: 'Promotion of agricultural mechanization through subsidies on farm equipment and custom hiring centers.',
      benefits: [
        '40-50% subsidy on agricultural machinery',
        'Custom Hiring Centers for small farmers',
        'Training programs on modern equipment',
        'Demonstration of new technologies'
      ],
      eligibility: [
        'Individual farmers',
        'Self Help Groups',
        'Farmer Producer Organizations',
        'Custom hiring service providers'
      ],
      documents: [
        'Application Form',
        'Aadhaar Card',
        'Bank Account Details',
        'Land Documents',
        'Quotation from dealer'
      ],
      applicationProcess: [
        'Apply through state agriculture department',
        'Submit application with required documents',
        'Technical committee verification',
        'Approval and subsidy sanction',
        'Purchase equipment and claim subsidy'
      ],
      budget: '₹1,033 crores (2024-25)',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      status: 'active',
      targetBeneficiaries: '20+ lakh farmers',
      website: 'https://agrimachinery.nic.in',
      helpline: '011-23388506'
    },
    {
      id: '5',
      name: 'Pradhan Mantri Krishi Sinchai Yojana (PMKSY)',
      category: 'subsidy',
      description: 'Irrigation scheme focusing on water conservation and precision irrigation for sustainable agriculture.',
      benefits: [
        '90% financial assistance for micro-irrigation',
        'Drip and sprinkler irrigation promotion',
        'Water conservation techniques',
        'Improved water use efficiency'
      ],
      eligibility: [
        'All categories of farmers',
        'Self Help Groups',
        'Farmer Producer Organizations',
        'Cooperative societies'
      ],
      documents: [
        'Application Form',
        'Land Ownership Certificate',
        'Bank Account Details',
        'Water Source Proof',
        'Project Estimate'
      ],
      applicationProcess: [
        'Apply through district collector office',
        'Submit detailed project proposal',
        'Technical scrutiny and field verification',
        'Approval and fund release',
        'Implementation and monitoring'
      ],
      budget: '₹93,068 crores (total allocation)',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      status: 'active',
      targetBeneficiaries: '22+ lakh hectares coverage',
      website: 'https://pmksy.gov.in',
      helpLine: '011-23381008'
    },
    {
      id: '6',
      name: 'National Agriculture Market (e-NAM)',
      category: 'technology',
      description: 'Online trading platform for agricultural commodities to provide better price discovery.',
      benefits: [
        'Better price realization for farmers',
        'Transparent auction process',
        'Reduced transaction costs',
        'Quality assaying facilities',
        'Online payment system'
      ],
      eligibility: [
        'Registered farmers',
        'Licensed traders',
        'Commission agents',
        'Registered at integrated mandis'
      ],
      documents: [
        'Farmer Registration Form',
        'Identity Proof',
        'Bank Account Details',
        'Mobile Number',
        'Gate Pass from mandi'
      ],
      applicationProcess: [
        'Register at nearest integrated mandi',
        'Create profile on e-NAM portal',
        'Upload produce details and samples',
        'Participate in online auction',
        'Receive payment directly in bank account'
      ],
      budget: '₹2,849 crores (total project cost)',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      status: 'active',
      targetBeneficiaries: '1.74+ crore farmers',
      website: 'https://enam.gov.in',
      helpline: '1800-270-0224'
    }
  ]

  const myApplications: Application[] = [
    {
      id: '1',
      schemeName: 'PM-KISAN',
      applicationDate: '2024-12-15',
      status: 'approved',
      applicationNumber: 'PMK2024123456',
      lastUpdated: '2025-01-08',
    },
    {
      id: '2',
      schemeName: 'PMFBY - Wheat Insurance',
      applicationDate: '2024-11-20',
      status: 'under-review',
      applicationNumber: 'PMFBY2024987654',
      lastUpdated: '2025-01-05',
      nextAction: 'Field verification pending'
    },
    {
      id: '3',
      schemeName: 'KCC Application',
      applicationDate: '2024-10-10',
      status: 'documents-required',
      applicationNumber: 'KCC2024567890',
      lastUpdated: '2024-12-20',
      nextAction: 'Submit updated income certificate'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-red-100 text-red-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'under-review': return 'bg-yellow-100 text-yellow-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'documents-required': return 'bg-orange-100 text-orange-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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

  const filteredSchemes = governmentSchemes.filter(scheme => {
    const categoryMatch = selectedCategory === 'all' || scheme.category === selectedCategory
    const searchMatch = searchTerm === '' || 
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-2">Government Schemes</h1>
        <p className="text-muted-foreground">
          Explore and apply for various government schemes and subsidies available for farmers
        </p>
      </div>

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
            {filteredSchemes.map((scheme) => (
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
                      <Button variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Official Website
                      </Button>
                    )}
                    {scheme.helpline && (
                      <Button variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        {scheme.helpline}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Scheme Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myApplications.map((application) => (
                  <div key={application.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{application.schemeName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Application #: {application.applicationNumber}
                        </p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
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
                ))}
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
                        <SelectItem value="marginal">Marginal Farmer (< 1 hectare)</SelectItem>
                        <SelectItem value="small">Small Farmer (1-2 hectares)</SelectItem>
                        <SelectItem value="medium">Medium Farmer (2-10 hectares)</SelectItem>
                        <SelectItem value="large">Large Farmer (> 10 hectares)</SelectItem>
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
                <Button className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Check Eligible Schemes
                </Button>
              </div>
            </CardContent>
          </Card>
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