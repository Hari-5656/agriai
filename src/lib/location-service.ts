// Location Service for Geolocation and Location Management
// Handles browser geolocation API, reverse geocoding, and location preferences

export interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  address?: {
    city?: string
    state?: string
    country?: string
    district?: string
    formatted?: string
  }
  timestamp: number
}

export interface LocationPermission {
  granted: boolean
  denied: boolean
  prompt: boolean
  error?: string
}

export interface LocationError {
  code: number
  message: string
  type: 'permission' | 'timeout' | 'unavailable' | 'unknown'
}

class LocationService {
  private static instance: LocationService
  private currentLocation: LocationData | null = null
  private permissionStatus: LocationPermission = {
    granted: false,
    denied: false,
    prompt: true
  }

  private constructor() {
    this.checkPermissionStatus()
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService()
    }
    return LocationService.instance
  }

  // Check current permission status
  private checkPermissionStatus(): void {
    if (!navigator.permissions) {
      this.permissionStatus = {
        granted: false,
        denied: false,
        prompt: true,
        error: 'Permissions API not supported'
      }
      return
    }

    navigator.permissions.query({ name: 'geolocation' as PermissionName })
      .then((result) => {
        this.permissionStatus = {
          granted: result.state === 'granted',
          denied: result.state === 'denied',
          prompt: result.state === 'prompt',
          error: result.state === 'denied' ? 'Location access denied' : undefined
        }
      })
      .catch(() => {
        this.permissionStatus = {
          granted: false,
          denied: false,
          prompt: true,
          error: 'Could not check permission status'
        }
      })
  }

  // Get current location with high accuracy
  public async getCurrentLocation(options?: {
    enableHighAccuracy?: boolean
    timeout?: number
    maximumAge?: number
  }): Promise<LocationData> {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }

    const finalOptions = { ...defaultOptions, ...options }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 0,
          message: 'Geolocation is not supported by this browser',
          type: 'unavailable' as const
        })
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            }

            // Get address information through reverse geocoding
            try {
              const address = await this.reverseGeocode(locationData.latitude, locationData.longitude)
              locationData.address = address
            } catch (error) {
              console.warn('Reverse geocoding failed:', error)
            }

            this.currentLocation = locationData
            this.permissionStatus.granted = true
            this.permissionStatus.denied = false
            this.permissionStatus.prompt = false

            resolve(locationData)
          } catch (error) {
            reject({
              code: 0,
              message: 'Failed to process location data',
              type: 'unknown' as const
            })
          }
        },
        (error) => {
          const locationError: LocationError = {
            code: error.code,
            message: error.message,
            type: this.getErrorType(error.code)
          }

          this.permissionStatus.granted = false
          this.permissionStatus.denied = error.code === 1
          this.permissionStatus.prompt = error.code === 1
          this.permissionStatus.error = locationError.message

          reject(locationError)
        },
        finalOptions
      )
    })
  }

  // Watch location changes
  public watchLocation(
    callback: (location: LocationData) => void,
    errorCallback?: (error: LocationError) => void,
    options?: {
      enableHighAccuracy?: boolean
      timeout?: number
      maximumAge?: number
    }
  ): number | null {
    if (!navigator.geolocation) {
      errorCallback?.({
        code: 0,
        message: 'Geolocation is not supported by this browser',
        type: 'unavailable'
      })
      return null
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    }

    const finalOptions = { ...defaultOptions, ...options }

    return navigator.geolocation.watchPosition(
      async (position) => {
        try {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          }

          // Get address information
          try {
            const address = await this.reverseGeocode(locationData.latitude, locationData.longitude)
            locationData.address = address
          } catch (error) {
            console.warn('Reverse geocoding failed:', error)
          }

          this.currentLocation = locationData
          callback(locationData)
        } catch (error) {
          errorCallback?.({
            code: 0,
            message: 'Failed to process location data',
            type: 'unknown'
          })
        }
      },
      (error) => {
        const locationError: LocationError = {
          code: error.code,
          message: error.message,
          type: this.getErrorType(error.code)
        }
        errorCallback?.(locationError)
      },
      finalOptions
    )
  }

  // Stop watching location
  public stopWatching(watchId: number): void {
    navigator.geolocation.clearWatch(watchId)
  }

  // Reverse geocoding to get address from coordinates
  private async reverseGeocode(latitude: number, longitude: number): Promise<LocationData['address']> {
    try {
      // Using Open-Meteo's geocoding API for reverse lookup
      const url = `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.status}`)
      }

      const data = await response.json()
      const result = data.results?.[0]

      if (!result) {
        throw new Error('No address found for coordinates')
      }

      return {
        city: result.name,
        state: result.admin1,
        country: result.country,
        district: result.admin2,
        formatted: `${result.name}, ${result.admin1 || ''}, ${result.country}`.replace(/,\s*,/g, ',').replace(/,\s*$/, '')
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      throw error
    }
  }

  // Get location by query (forward geocoding)
  public async getLocationByQuery(query: string): Promise<LocationData> {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`)
      }

      const data = await response.json()
      const result = data.results?.[0]

      if (!result) {
        throw new Error('Location not found')
      }

      const locationData: LocationData = {
        latitude: result.latitude,
        longitude: result.longitude,
        timestamp: Date.now(),
        address: {
          city: result.name,
          state: result.admin1,
          country: result.country,
          district: result.admin2,
          formatted: `${result.name}, ${result.admin1 || ''}, ${result.country}`.replace(/,\s*,/g, ',').replace(/,\s*$/, '')
        }
      }

      return locationData
    } catch (error) {
      console.error('Geocoding error:', error)
      throw error
    }
  }

  // Get cached location
  public getCachedLocation(): LocationData | null {
    return this.currentLocation
  }

  // Get permission status
  public getPermissionStatus(): LocationPermission {
    return { ...this.permissionStatus }
  }

  // Request location permission
  public async requestPermission(): Promise<LocationPermission> {
    try {
      await this.getCurrentLocation({ timeout: 5000 })
      return this.getPermissionStatus()
    } catch (error) {
      return this.getPermissionStatus()
    }
  }

  // Check if location is available
  public isLocationAvailable(): boolean {
    return 'geolocation' in navigator
  }

  // Get distance between two coordinates (in kilometers)
  public getDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180)
  }

  private getErrorType(code: number): LocationError['type'] {
    switch (code) {
      case 1:
        return 'permission'
      case 2:
        return 'unavailable'
      case 3:
        return 'timeout'
      default:
        return 'unknown'
    }
  }

  // Format location for display
  public formatLocation(location: LocationData): string {
    if (location.address?.formatted) {
      return location.address.formatted
    }
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
  }

  // Get location string for weather API
  public getLocationString(location: LocationData): string {
    if (location.address?.formatted) {
      return location.address.formatted
    }
    return `${location.latitude},${location.longitude}`
  }
}

// Export singleton instance
export const locationService = LocationService.getInstance()

// Export utility functions
export const getCurrentLocation = () => locationService.getCurrentLocation()
export const getLocationByQuery = (query: string) => locationService.getLocationByQuery(query)
export const requestLocationPermission = () => locationService.requestPermission()
export const isLocationAvailable = () => locationService.isLocationAvailable()
export const getCachedLocation = () => locationService.getCachedLocation()
export const getPermissionStatus = () => locationService.getPermissionStatus()
