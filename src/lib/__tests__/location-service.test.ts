// Test file for Location Service
import { locationService, type LocationData } from '../location-service'

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}

// Mock navigator.permissions
const mockPermissions = {
  query: jest.fn(),
}

// Mock fetch
global.fetch = jest.fn()

describe('Location Service', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    
    // Mock navigator
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    })
    
    Object.defineProperty(global.navigator, 'permissions', {
      value: mockPermissions,
      writable: true,
    })
  })

  test('should check if location is available', () => {
    expect(locationService.isLocationAvailable()).toBe(true)
  })

  test('should handle geolocation not available', () => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      writable: true,
    })
    
    expect(locationService.isLocationAvailable()).toBe(false)
  })

  test('should get current location successfully', async () => {
    const mockPosition = {
      coords: {
        latitude: 28.6139,
        longitude: 77.2090,
        accuracy: 10
      },
      timestamp: Date.now()
    }

    const mockGeocodingResponse = {
      results: [{
        name: 'New Delhi',
        country: 'India',
        admin1: 'Delhi',
        admin2: 'New Delhi'
      }]
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition)
    })

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeocodingResponse
    })

    const result = await locationService.getCurrentLocation()

    expect(result).toEqual({
      latitude: 28.6139,
      longitude: 77.2090,
      accuracy: 10,
      timestamp: mockPosition.timestamp,
      address: {
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        district: 'New Delhi',
        formatted: 'New Delhi, Delhi, India'
      }
    })
  })

  test('should handle geolocation error', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 1,
        message: 'User denied geolocation'
      })
    })

    await expect(locationService.getCurrentLocation()).rejects.toEqual({
      code: 1,
      message: 'User denied geolocation',
      type: 'permission'
    })
  })

  test('should get location by query', async () => {
    const mockGeocodingResponse = {
      results: [{
        name: 'Mumbai',
        country: 'India',
        admin1: 'Maharashtra',
        latitude: 19.0760,
        longitude: 72.8777
      }]
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeocodingResponse
    })

    const result = await locationService.getLocationByQuery('Mumbai')

    expect(result).toEqual({
      latitude: 19.0760,
      longitude: 72.8777,
      timestamp: expect.any(Number),
      address: {
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        district: undefined,
        formatted: 'Mumbai, Maharashtra, India'
      }
    })
  })

  test('should calculate distance between coordinates', () => {
    const distance = locationService.getDistance(28.6139, 77.2090, 19.0760, 72.8777)
    expect(distance).toBeCloseTo(1154, 0) // Approximate distance between Delhi and Mumbai
  })

  test('should format location for display', () => {
    const location: LocationData = {
      latitude: 28.6139,
      longitude: 77.2090,
      timestamp: Date.now(),
      address: {
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        formatted: 'New Delhi, Delhi, India'
      }
    }

    expect(locationService.formatLocation(location)).toBe('New Delhi, Delhi, India')
  })

  test('should get location string for weather API', () => {
    const location: LocationData = {
      latitude: 28.6139,
      longitude: 77.2090,
      timestamp: Date.now(),
      address: {
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        formatted: 'New Delhi, Delhi, India'
      }
    }

    expect(locationService.getLocationString(location)).toBe('New Delhi, Delhi, India')
  })

  test('should handle watch location', () => {
    const mockWatchId = 123
    mockGeolocation.watchPosition.mockReturnValue(mockWatchId)

    const callback = jest.fn()
    const errorCallback = jest.fn()

    const watchId = locationService.watchLocation(callback, errorCallback)

    expect(watchId).toBe(mockWatchId)
    expect(mockGeolocation.watchPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.any(Object)
    )
  })

  test('should stop watching location', () => {
    const watchId = 123
    locationService.stopWatching(watchId)
    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(watchId)
  })
})
