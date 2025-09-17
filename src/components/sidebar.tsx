import React from 'react'
import { Button } from './ui/button'
import { useLanguage } from './language-provider'
import { 
  LayoutDashboard, 
  Wheat, 
  Sprout, 
  CloudRain, 
  Layers, 
  Droplets, 
  Search, 
  TrendingUp,
  Leaf,
  FileText
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { translate } = useLanguage()

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: translate('dashboard') },
    { id: 'crop-recommendation', icon: Wheat, label: translate('cropRecommendation') },
    { id: 'fertilizer-guide', icon: Sprout, label: translate('fertilizerGuide') },
    { id: 'weather-alerts', icon: CloudRain, label: translate('weatherAlerts') },
    { id: 'soil-data', icon: Layers, label: translate('soilData') },
    { id: 'water-availability', icon: Droplets, label: translate('waterAvailability') },
    { id: 'disease-detection', icon: Search, label: translate('diseaseDetection') },
    { id: 'market-prices', icon: TrendingUp, label: translate('marketPrices') },
    { id: 'government-schemes', icon: FileText, label: translate('governmentSchemes') }
  ]

  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Leaf className="h-5 w-5  text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg text-green-500 font-semibold">AgriSwayam</h1>
            <p className="text-sm text-muted-foreground">Smart Farming Assistant</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}