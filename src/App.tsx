import { useState } from 'react'
import { Sidebar } from './components/sidebar'
import { Header } from './components/header'
import { Dashboard } from './components/dashboard'
import { CropRecommendation } from './components/crop-recommendation'
import { FertilizerGuide } from './components/fertilizer-guide'
import { WeatherAlerts } from './components/weather-alerts'
import { SoilData } from './components/soil-data'
import { WaterAvailability } from './components/water-availability'
import { DiseaseDetection } from './components/disease-detection'
import { MarketPrices } from './components/market-prices'
import { GovernmentSchemes } from './components/government-schemes'
import { Chatbot } from './components/chatbot'
import { LanguageProvider } from './components/language-provider'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'crop-recommendation':
        return <CropRecommendation />
      case 'fertilizer-guide':
        return <FertilizerGuide />
      case 'weather-alerts':
        return <WeatherAlerts />
      case 'soil-data':
        return <SoilData />
      case 'water-availability':
        return <WaterAvailability />
      case 'disease-detection':
        return <DiseaseDetection />
      case 'market-prices':
        return <MarketPrices />
      case 'government-schemes':
        return <GovernmentSchemes />
      default:
        return <Dashboard />
    }
  }

  return (
    <LanguageProvider>
      <div className="flex h-screen bg-background">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
        <Chatbot />
      </div>
    </LanguageProvider>
  )
}