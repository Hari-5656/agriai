import { createContext, useContext, useState, type PropsWithChildren } from 'react'

interface Language {
  code: string
  name: string
  flag: string
}

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  languages: Language[]
  translate: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' }
]

// Mock translations (in a real app, this would come from a translation service)
const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    cropRecommendation: 'Crop Recommendation',
    fertilizerGuide: 'Fertilizer Guide',
    weatherAlerts: 'Weather & Pest Alerts',
    soilData: 'Soil Data',
    waterAvailability: 'Water Availability',
    diseaseDetection: 'Disease Detection',
    marketPrices: 'Market Prices',
    governmentSchemes: 'Government Schemes',
    welcomeFarmer: 'Welcome, Farmer!',
    askQuestion: 'Ask me anything about farming...',
    uploadImage: 'Upload plant image for disease detection',
    currentWeather: 'Current Weather',
    soilHealth: 'Soil Health',
    waterLevel: 'Water Level',
    marketTrends: 'Market Trends'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    cropRecommendation: 'फसल सिफारिश',
    fertilizerGuide: 'उर्वरक गाइड',
    weatherAlerts: 'मौसम और कीट अलर्ट',
    soilData: 'मिट्टी डेटा',
    waterAvailability: 'पानी की उपलब्धता',
    diseaseDetection: 'रोग का पता लगाना',
    marketPrices: 'बाजार भाव',
    governmentSchemes: 'सरकारी योजनाएं',
    welcomeFarmer: 'स्वागत है, किसान!',
    askQuestion: 'खेती के बारे में मुझसे कुछ भी पूछें...',
    uploadImage: 'रोग की पहचान के लिए पौधे की तस्वीर अपलोड करें',
    currentWeather: 'वर्तमान मौसम',
    soilHealth: 'मिट्टी का स्वास्थ्य',
    waterLevel: 'पानी का स्तर',
    marketTrends: 'बाजार के रुझान'
  }
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
  }

  const translate = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages, translate }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}