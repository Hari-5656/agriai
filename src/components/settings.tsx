import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Switch } from './ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useTheme } from './theme-provider'
import { useLanguage } from './language-provider'

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { currentLanguage, setLanguage, languages } = useLanguage()

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = window.localStorage.getItem('agriai-notifications-enabled')
    return saved ? saved === 'true' : true
  })
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>(() => {
    return (window.localStorage.getItem('agriai-temperature-unit') as 'C' | 'F') || 'C'
  })
  const [windUnit, setWindUnit] = useState<'km/h' | 'mph'>(() => {
    return (window.localStorage.getItem('agriai-wind-unit') as 'km/h' | 'mph') || 'km/h'
  })
  const [dataSaver, setDataSaver] = useState<boolean>(() => {
    const saved = window.localStorage.getItem('agriai-data-saver')
    return saved ? saved === 'true' : false
  })
  const [compactMode, setCompactMode] = useState<boolean>(() => {
    const saved = window.localStorage.getItem('agriai-compact-mode')
    return saved ? saved === 'true' : false
  })
  const [defaultTab, setDefaultTab] = useState<string>(() => {
    return window.localStorage.getItem('agriai-default-tab') || 'dashboard'
  })

  useEffect(() => {
    try { window.localStorage.setItem('agriai-notifications-enabled', String(notificationsEnabled)) } catch {}
  }, [notificationsEnabled])

  useEffect(() => {
    try { window.localStorage.setItem('agriai-temperature-unit', temperatureUnit) } catch {}
  }, [temperatureUnit])

  useEffect(() => {
    try { window.localStorage.setItem('agriai-wind-unit', windUnit) } catch {}
  }, [windUnit])

  useEffect(() => {
    try { window.localStorage.setItem('agriai-data-saver', String(dataSaver)) } catch {}
  }, [dataSaver])

  useEffect(() => {
    try { window.localStorage.setItem('agriai-compact-mode', String(compactMode)) } catch {}
  }, [compactMode])

  useEffect(() => {
    try { window.localStorage.setItem('agriai-default-tab', defaultTab) } catch {}
  }, [defaultTab])

  const tabs = useMemo(() => ([
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'crop-recommendation', label: 'Crop Recommendation' },
    { id: 'fertilizer-guide', label: 'Fertilizer Guide' },
    { id: 'weather-alerts', label: 'Weather & Pest Alerts' },
    { id: 'soil-data', label: 'Soil Data' },
    { id: 'water-availability', label: 'Water Availability' },
    { id: 'disease-detection', label: 'Disease Detection' },
    { id: 'market-prices', label: 'Market Prices' },
    { id: 'government-schemes', label: 'Government Schemes' },
    { id: 'profile', label: 'Profile' },
    { id: 'settings', label: 'Settings' },
  ]), [])

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Notifications</div>
              <div className="text-xs text-muted-foreground">Enable system notifications and alerts</div>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Theme</div>
              <div className="text-xs text-muted-foreground">Choose appearance preference</div>
            </div>
            <Select value={theme} onValueChange={(v) => setTheme(v as typeof theme)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Language</div>
              <div className="text-xs text-muted-foreground">Choose your preferred language</div>
            </div>
            <Select value={currentLanguage.code} onValueChange={(code) => {
              const lang = languages.find(l => l.code === code)
              if (lang) setLanguage(lang)
            }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l.code} value={l.code}>{`${l.flag} ${l.name}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Units & Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Temperature unit</div>
              <div className="text-xs text-muted-foreground">Show temperature in Celsius or Fahrenheit</div>
            </div>
            <Select value={temperatureUnit} onValueChange={(v) => setTemperatureUnit(v as 'C' | 'F')}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C">Celsius (°C)</SelectItem>
                <SelectItem value="F">Fahrenheit (°F)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Wind speed unit</div>
              <div className="text-xs text-muted-foreground">Show wind speed in km/h or mph</div>
            </div>
            <Select value={windUnit} onValueChange={(v) => setWindUnit(v as 'km/h' | 'mph')}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km/h">Kilometers/hour</SelectItem>
                <SelectItem value="mph">Miles/hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Data saver</div>
              <div className="text-xs text-muted-foreground">Reduce data usage and background fetching</div>
            </div>
            <Switch checked={dataSaver} onCheckedChange={setDataSaver} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interface</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Compact mode</div>
              <div className="text-xs text-muted-foreground">Denser layout with smaller paddings</div>
            </div>
            <Switch checked={compactMode} onCheckedChange={setCompactMode} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Default landing page</div>
              <div className="text-xs text-muted-foreground">Open this page on app start</div>
            </div>
            <Select value={defaultTab} onValueChange={(v) => setDefaultTab(v)}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tabs.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


