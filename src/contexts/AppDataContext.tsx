import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  fetchCurrentWeatherByQuery, 
  fetchCurrentWeatherByCoordinates,
  type RapidCurrentResponse 
} from '../lib/weather'
import { locationService, type LocationData } from '../lib/location-service'

// Data interfaces
export interface WeatherData {
  current: RapidCurrentResponse | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export interface SoilData {
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  moisture: number
  temperature: number
  organicMatter: number
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export interface MarketData {
  wheat: { price: number; trend: 'up' | 'down' | 'stable' }
  rice: { price: number; trend: 'up' | 'down' | 'stable' }
  cotton: { price: number; trend: 'up' | 'down' | 'stable' }
  sugarcane: { price: number; trend: 'up' | 'down' | 'stable' }
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export interface CropHealthData {
  wheat: { health: number; status: string; issues: string[] }
  rice: { health: number; status: string; issues: string[] }
  corn: { health: number; status: string; issues: string[] }
  cotton: { health: number; status: string; issues: string[] }
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export interface WaterData {
  level: number
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  ph: number
  temperature: number
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export interface AppData {
  weather: WeatherData
  soil: SoilData
  market: MarketData
  cropHealth: CropHealthData
  water: WaterData
  location: LocationData | null
  lastGlobalUpdate: Date | null
}

interface AppDataContextType {
  data: AppData
  updateWeather: (location?: string) => Promise<void>
  updateSoil: () => Promise<void>
  updateMarket: () => Promise<void>
  updateCropHealth: () => Promise<void>
  updateWater: () => Promise<void>
  updateLocation: () => Promise<void>
  refreshAllData: () => Promise<void>
  setLocation: (location: string) => void
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined)

// Initial data state
const initialData: AppData = {
  weather: {
    current: null,
    loading: false,
    error: null,
    lastUpdated: null
  },
  soil: {
    ph: 6.8,
    nitrogen: 78,
    phosphorus: 45,
    potassium: 62,
    moisture: 65,
    temperature: 25,
    organicMatter: 3.2,
    loading: false,
    error: null,
    lastUpdated: null
  },
  market: {
    wheat: { price: 2450, trend: 'up' },
    rice: { price: 3200, trend: 'stable' },
    cotton: { price: 6800, trend: 'down' },
    sugarcane: { price: 320, trend: 'up' },
    loading: false,
    error: null,
    lastUpdated: null
  },
  cropHealth: {
    wheat: { health: 92, status: 'Excellent', issues: [] },
    rice: { health: 78, status: 'Good', issues: ['Minor pest activity'] },
    corn: { health: 85, status: 'Good', issues: [] },
    cotton: { health: 67, status: 'Fair', issues: ['Water stress', 'Nutrient deficiency'] },
    loading: false,
    error: null,
    lastUpdated: null
  },
  water: {
    level: 78,
    quality: 'good',
    ph: 7.2,
    temperature: 22,
    loading: false,
    error: null,
    lastUpdated: null
  },
  location: null,
  lastGlobalUpdate: null
}

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialData)
  const [currentLocation, setCurrentLocation] = useState<string>('Punjab, IN')

  // Update weather data
  const updateWeather = async (location?: string) => {
    const targetLocation = location || currentLocation
    setData(prev => ({
      ...prev,
      weather: { ...prev.weather, loading: true, error: null }
    }))

    try {
      let weatherData: RapidCurrentResponse

      // Try to get current location first
      if (!location) {
        try {
          const locationData = await locationService.getCurrentLocation()
          weatherData = await fetchCurrentWeatherByCoordinates(
            locationData.latitude,
            locationData.longitude,
            locationData.address?.city,
            locationData.address?.state,
            locationData.address?.country
          )
          setData(prev => ({ ...prev, location: locationData }))
        } catch (error) {
          // Fallback to query-based weather
          weatherData = await fetchCurrentWeatherByQuery(targetLocation)
        }
      } else {
        weatherData = await fetchCurrentWeatherByQuery(targetLocation)
      }

      setData(prev => ({
        ...prev,
        weather: {
          current: weatherData,
          loading: false,
          error: null,
          lastUpdated: new Date()
        },
        lastGlobalUpdate: new Date()
      }))
    } catch (error: any) {
      setData(prev => ({
        ...prev,
        weather: {
          ...prev.weather,
          loading: false,
          error: error.message || 'Failed to fetch weather data'
        }
      }))
    }
  }

  // Update soil data (simulated with some variation)
  const updateSoil = async () => {
    setData(prev => ({
      ...prev,
      soil: { ...prev.soil, loading: true, error: null }
    }))

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate realistic soil data with some variation
      const baseData = data.soil
      const variation = () => (Math.random() - 0.5) * 10 // ±5% variation

      const newSoilData: SoilData = {
        ph: Math.max(5.0, Math.min(8.5, baseData.ph + variation() / 10)),
        nitrogen: Math.max(0, Math.min(100, baseData.nitrogen + variation())),
        phosphorus: Math.max(0, Math.min(100, baseData.phosphorus + variation())),
        potassium: Math.max(0, Math.min(100, baseData.potassium + variation())),
        moisture: Math.max(0, Math.min(100, baseData.moisture + variation())),
        temperature: Math.max(10, Math.min(40, baseData.temperature + variation() / 2)),
        organicMatter: Math.max(0, Math.min(10, baseData.organicMatter + variation() / 20)),
        loading: false,
        error: null,
        lastUpdated: new Date()
      }

      setData(prev => ({
        ...prev,
        soil: newSoilData,
        lastGlobalUpdate: new Date()
      }))
    } catch (error: any) {
      setData(prev => ({
        ...prev,
        soil: {
          ...prev.soil,
          loading: false,
          error: error.message || 'Failed to fetch soil data'
        }
      }))
    }
  }

  // Update market data
  const updateMarket = async () => {
    setData(prev => ({
      ...prev,
      market: { ...prev.market, loading: true, error: null }
    }))

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Generate realistic market data with trends
      const baseData = data.market
      const priceVariation = () => (Math.random() - 0.5) * 200 // ±100 price variation
      const getTrend = (oldPrice: number, newPrice: number): 'up' | 'down' | 'stable' => {
        const diff = newPrice - oldPrice
        if (diff > 50) return 'up'
        if (diff < -50) return 'down'
        return 'stable'
      }

      const newWheatPrice = Math.max(2000, baseData.wheat.price + priceVariation())
      const newRicePrice = Math.max(2500, baseData.rice.price + priceVariation())
      const newCottonPrice = Math.max(6000, baseData.cotton.price + priceVariation())
      const newSugarcanePrice = Math.max(250, baseData.sugarcane.price + priceVariation() / 10)

      const newMarketData: MarketData = {
        wheat: { price: Math.round(newWheatPrice), trend: getTrend(baseData.wheat.price, newWheatPrice) },
        rice: { price: Math.round(newRicePrice), trend: getTrend(baseData.rice.price, newRicePrice) },
        cotton: { price: Math.round(newCottonPrice), trend: getTrend(baseData.cotton.price, newCottonPrice) },
        sugarcane: { price: Math.round(newSugarcanePrice), trend: getTrend(baseData.sugarcane.price, newSugarcanePrice) },
        loading: false,
        error: null,
        lastUpdated: new Date()
      }

      setData(prev => ({
        ...prev,
        market: newMarketData,
        lastGlobalUpdate: new Date()
      }))
    } catch (error: any) {
      setData(prev => ({
        ...prev,
        market: {
          ...prev.market,
          loading: false,
          error: error.message || 'Failed to fetch market data'
        }
      }))
    }
  }

  // Update crop health data
  const updateCropHealth = async () => {
    setData(prev => ({
      ...prev,
      cropHealth: { ...prev.cropHealth, loading: true, error: null }
    }))

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200))

      // Generate realistic crop health data
      const baseData = data.cropHealth
      const healthVariation = () => (Math.random() - 0.5) * 20 // ±10% health variation

      const getHealthStatus = (health: number): string => {
        if (health >= 90) return 'Excellent'
        if (health >= 70) return 'Good'
        if (health >= 50) return 'Fair'
        return 'Poor'
      }

      const getIssues = (health: number): string[] => {
        const issues: string[] = []
        if (health < 80) issues.push('Minor pest activity')
        if (health < 70) issues.push('Water stress')
        if (health < 60) issues.push('Nutrient deficiency')
        if (health < 50) issues.push('Disease detected')
        return issues
      }

      const newCropHealthData: CropHealthData = {
        wheat: {
          health: Math.max(0, Math.min(100, baseData.wheat.health + healthVariation())),
          status: '',
          issues: []
        },
        rice: {
          health: Math.max(0, Math.min(100, baseData.rice.health + healthVariation())),
          status: '',
          issues: []
        },
        corn: {
          health: Math.max(0, Math.min(100, baseData.corn.health + healthVariation())),
          status: '',
          issues: []
        },
        cotton: {
          health: Math.max(0, Math.min(100, baseData.cotton.health + healthVariation())),
          status: '',
          issues: []
        },
        loading: false,
        error: null,
        lastUpdated: new Date()
      }

      // Set status and issues based on health
      Object.keys(newCropHealthData).forEach(crop => {
        if (crop !== 'loading' && crop !== 'error' && crop !== 'lastUpdated') {
          const cropData = newCropHealthData[crop as keyof Omit<CropHealthData, 'loading' | 'error' | 'lastUpdated'>]
          cropData.status = getHealthStatus(cropData.health)
          cropData.issues = getIssues(cropData.health)
        }
      })

      setData(prev => ({
        ...prev,
        cropHealth: newCropHealthData,
        lastGlobalUpdate: new Date()
      }))
    } catch (error: any) {
      setData(prev => ({
        ...prev,
        cropHealth: {
          ...prev.cropHealth,
          loading: false,
          error: error.message || 'Failed to fetch crop health data'
        }
      }))
    }
  }

  // Update water data
  const updateWater = async () => {
    setData(prev => ({
      ...prev,
      water: { ...prev.water, loading: true, error: null }
    }))

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600))

      // Generate realistic water data
      const baseData = data.water
      const variation = () => (Math.random() - 0.5) * 10 // ±5% variation

      const getQualityStatus = (level: number, ph: number): 'excellent' | 'good' | 'fair' | 'poor' => {
        if (level >= 80 && ph >= 6.5 && ph <= 7.5) return 'excellent'
        if (level >= 60 && ph >= 6.0 && ph <= 8.0) return 'good'
        if (level >= 40 && ph >= 5.5 && ph <= 8.5) return 'fair'
        return 'poor'
      }

      const newLevel = Math.max(0, Math.min(100, baseData.level + variation()))
      const newPh = Math.max(5.0, Math.min(9.0, baseData.ph + variation() / 10))
      const newTemp = Math.max(10, Math.min(35, baseData.temperature + variation() / 2))

      const newWaterData: WaterData = {
        level: Math.round(newLevel),
        quality: getQualityStatus(newLevel, newPh),
        ph: Math.round(newPh * 10) / 10,
        temperature: Math.round(newTemp),
        loading: false,
        error: null,
        lastUpdated: new Date()
      }

      setData(prev => ({
        ...prev,
        water: newWaterData,
        lastGlobalUpdate: new Date()
      }))
    } catch (error: any) {
      setData(prev => ({
        ...prev,
        water: {
          ...prev.water,
          loading: false,
          error: error.message || 'Failed to fetch water data'
        }
      }))
    }
  }

  // Update location
  const updateLocation = async () => {
    try {
      const locationData = await locationService.getCurrentLocation()
      setData(prev => ({
        ...prev,
        location: locationData,
        lastGlobalUpdate: new Date()
      }))
    } catch (error) {
      console.warn('Failed to get current location:', error)
    }
  }

  // Set location manually
  const setLocation = (location: string) => {
    setCurrentLocation(location)
    updateWeather(location)
  }

  // Refresh all data
  const refreshAllData = async () => {
    await Promise.all([
      updateWeather(),
      updateSoil(),
      updateMarket(),
      updateCropHealth(),
      updateWater()
    ])
  }

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAllData()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  // Initial data load
  useEffect(() => {
    refreshAllData()
  }, [])

  const contextValue: AppDataContextType = {
    data,
    updateWeather,
    updateSoil,
    updateMarket,
    updateCropHealth,
    updateWater,
    updateLocation,
    refreshAllData,
    setLocation
  }

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider')
  }
  return context
}
