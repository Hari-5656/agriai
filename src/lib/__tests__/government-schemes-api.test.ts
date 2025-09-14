// Test file for Government Schemes API
import { governmentSchemesAPI, EligibilityCriteria } from '../government-schemes-api'

describe('Government Schemes API', () => {
  test('should fetch all schemes', async () => {
    const schemes = await governmentSchemesAPI.getAllSchemes()
    expect(schemes).toBeDefined()
    expect(Array.isArray(schemes)).toBe(true)
    expect(schemes.length).toBeGreaterThan(0)
  })

  test('should fetch schemes by category', async () => {
    const schemes = await governmentSchemesAPI.getSchemesByCategory('subsidy')
    expect(schemes).toBeDefined()
    expect(Array.isArray(schemes)).toBe(true)
    schemes.forEach(scheme => {
      expect(scheme.category).toBe('subsidy')
    })
  })

  test('should search schemes', async () => {
    const schemes = await governmentSchemesAPI.searchSchemes('PM-KISAN')
    expect(schemes).toBeDefined()
    expect(Array.isArray(schemes)).toBe(true)
    expect(schemes.some(scheme => scheme.name.includes('PM-KISAN'))).toBe(true)
  })

  test('should check eligibility', async () => {
    const criteria: EligibilityCriteria = {
      landSize: 2.5,
      farmerCategory: 'small',
      annualIncome: 200000,
      cropType: 'wheat'
    }
    const schemes = await governmentSchemesAPI.checkEligibility(criteria)
    expect(schemes).toBeDefined()
    expect(Array.isArray(schemes)).toBe(true)
  })

  test('should get scheme by ID', async () => {
    const scheme = await governmentSchemesAPI.getSchemeById('1')
    expect(scheme).toBeDefined()
    expect(scheme?.id).toBe('1')
  })

  test('should get user applications', async () => {
    const applications = await governmentSchemesAPI.getUserApplications('test-user')
    expect(applications).toBeDefined()
    expect(Array.isArray(applications)).toBe(true)
  })

  test('should get scheme statistics', async () => {
    const stats = await governmentSchemesAPI.getSchemeStatistics()
    expect(stats).toBeDefined()
    expect(stats.totalSchemes).toBeGreaterThan(0)
    expect(stats.activeSchemes).toBeGreaterThan(0)
  })

  test('should open official website', () => {
    const mockOpen = jest.fn()
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true
    })
    
    governmentSchemesAPI.openOfficialWebsite('https://pmkisan.gov.in')
    expect(mockOpen).toHaveBeenCalledWith('https://pmkisan.gov.in', '_blank', 'noopener,noreferrer')
  })
})
