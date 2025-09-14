// Government Schemes API Service
// This service provides access to various government schemes and their official websites

export interface GovernmentScheme {
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
  apiEndpoint?: string
  stateSpecific?: boolean
  lastUpdated: string
}

export interface SchemeApplication {
  id: string
  schemeName: string
  applicationDate: string
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'documents-required'
  applicationNumber: string
  lastUpdated: string
  nextAction?: string
}

export interface EligibilityCriteria {
  landSize?: number
  farmerCategory?: 'marginal' | 'small' | 'medium' | 'large'
  annualIncome?: number
  cropType?: string
  state?: string
  age?: number
}

// Mock API endpoints - In production, these would be real government API endpoints
const API_BASE_URL = 'https://api.agroswayam.gov.in/schemes'
const EXTERNAL_APIS = {
  PM_KISAN: 'https://pmkisan.gov.in/api',
  PMFBY: 'https://pmfby.gov.in/api',
  E_NAM: 'https://enam.gov.in/api',
  NABARD: 'https://www.nabard.org/api',
  AGRICULTURE_GOV: 'https://agriculture.gov.in/api'
}

class GovernmentSchemesAPI {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  // Get all available schemes
  async getAllSchemes(): Promise<GovernmentScheme[]> {
    try {
      // In production, this would be a real API call
      const response = await fetch(`${this.baseUrl}/all`)
      if (!response.ok) {
        throw new Error('Failed to fetch schemes')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching schemes:', error)
      // Return mock data as fallback
      return this.getMockSchemes()
    }
  }

  // Get schemes by category
  async getSchemesByCategory(category: string): Promise<GovernmentScheme[]> {
    try {
      const response = await fetch(`${this.baseUrl}/category/${category}`)
      if (!response.ok) {
        throw new Error('Failed to fetch schemes by category')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching schemes by category:', error)
      return this.getMockSchemes().filter(scheme => scheme.category === category)
    }
  }

  // Get schemes by state
  async getSchemesByState(state: string): Promise<GovernmentScheme[]> {
    try {
      const response = await fetch(`${this.baseUrl}/state/${state}`)
      if (!response.ok) {
        throw new Error('Failed to fetch schemes by state')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching schemes by state:', error)
      return this.getMockSchemes()
    }
  }

  // Search schemes
  async searchSchemes(query: string): Promise<GovernmentScheme[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Failed to search schemes')
      }
      return await response.json()
    } catch (error) {
      console.error('Error searching schemes:', error)
      return this.getMockSchemes().filter(scheme => 
        scheme.name.toLowerCase().includes(query.toLowerCase()) ||
        scheme.description.toLowerCase().includes(query.toLowerCase())
      )
    }
  }

  // Check eligibility for schemes
  async checkEligibility(criteria: EligibilityCriteria): Promise<GovernmentScheme[]> {
    try {
      const response = await fetch(`${this.baseUrl}/eligibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteria)
      })
      if (!response.ok) {
        throw new Error('Failed to check eligibility')
      }
      return await response.json()
    } catch (error) {
      console.error('Error checking eligibility:', error)
      return this.getMockSchemes()
    }
  }

  // Get scheme details by ID
  async getSchemeById(id: string): Promise<GovernmentScheme | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch scheme details')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching scheme details:', error)
      return this.getMockSchemes().find(scheme => scheme.id === id) || null
    }
  }

  // Get user's applications
  async getUserApplications(userId: string): Promise<SchemeApplication[]> {
    try {
      const response = await fetch(`${this.baseUrl}/applications/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user applications')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching user applications:', error)
      return this.getMockApplications()
    }
  }

  // Submit new application
  async submitApplication(applicationData: any): Promise<{ success: boolean; applicationId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit application')
      }
      
      const result = await response.json()
      return { success: true, applicationId: result.applicationId }
    } catch (error) {
      console.error('Error submitting application:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get official website data
  async getOfficialWebsiteData(schemeId: string): Promise<{ url: string; title: string; description: string } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${schemeId}/website`)
      if (!response.ok) {
        throw new Error('Failed to fetch website data')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching website data:', error)
      return null
    }
  }

  // Open official website in new tab
  openOfficialWebsite(url: string): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  // Get scheme statistics
  async getSchemeStatistics(): Promise<{
    totalSchemes: number
    activeSchemes: number
    totalBudget: string
    totalBeneficiaries: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/statistics`)
      if (!response.ok) {
        throw new Error('Failed to fetch statistics')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching statistics:', error)
      return {
        totalSchemes: 6,
        activeSchemes: 5,
        totalBudget: '₹2,00,000+ crores',
        totalBeneficiaries: '50+ crore farmers'
      }
    }
  }

  // Mock data fallback
  private getMockSchemes(): GovernmentScheme[] {
    return [
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
        helpline: '011-24300677',
        apiEndpoint: EXTERNAL_APIS.PM_KISAN,
        stateSpecific: false,
        lastUpdated: '2025-01-08'
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
        helpline: '14447',
        apiEndpoint: EXTERNAL_APIS.PMFBY,
        stateSpecific: true,
        lastUpdated: '2025-01-08'
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
        helpline: '1800-180-1551',
        apiEndpoint: EXTERNAL_APIS.NABARD,
        stateSpecific: false,
        lastUpdated: '2025-01-08'
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
        helpline: '011-23388506',
        apiEndpoint: EXTERNAL_APIS.AGRICULTURE_GOV,
        stateSpecific: true,
        lastUpdated: '2025-01-08'
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
        helpline: '011-23381008',
        apiEndpoint: EXTERNAL_APIS.AGRICULTURE_GOV,
        stateSpecific: true,
        lastUpdated: '2025-01-08'
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
        helpline: '1800-270-0224',
        apiEndpoint: EXTERNAL_APIS.E_NAM,
        stateSpecific: true,
        lastUpdated: '2025-01-08'
      }
    ]
  }

  private getMockApplications(): SchemeApplication[] {
    return [
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
  }
}

// Export singleton instance
export const governmentSchemesAPI = new GovernmentSchemesAPI()

// Export utility functions
export const openOfficialWebsite = (url: string) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

export const formatCurrency = (amount: string) => {
  return amount.replace(/₹/g, '₹').replace(/crores/g, 'crores')
}

export const getSchemeStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'closed': return 'bg-red-100 text-red-800'
    case 'upcoming': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const getApplicationStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-800'
    case 'under-review': return 'bg-yellow-100 text-yellow-800'
    case 'submitted': return 'bg-blue-100 text-blue-800'
    case 'documents-required': return 'bg-orange-100 text-orange-800'
    case 'rejected': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
