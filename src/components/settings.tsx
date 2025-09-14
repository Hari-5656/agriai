import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Switch } from './ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { useTheme } from './theme-provider'
import { useLanguage } from './language-provider'
import { useNotifications } from '../contexts/NotificationContext'

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { currentLanguage, setLanguage, languages, translate } = useLanguage()
  const { state, updatePreferences, requestPermission } = useNotifications()

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
              <div className="text-sm font-medium">{translate('notifications')}</div>
              <div className="text-xs text-muted-foreground">Enable system notifications and alerts</div>
            </div>
            <Switch 
              checked={state.preferences.enabled} 
              onCheckedChange={(checked) => updatePreferences({ enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Browser Notifications</div>
              <div className="text-xs text-muted-foreground">Show desktop notifications</div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={state.preferences.channels.browser}
                onCheckedChange={(checked) => 
                  updatePreferences({ 
                    channels: { ...state.preferences.channels, browser: checked } 
                  })
                }
                disabled={!state.isPermissionGranted}
              />
              {!state.isPermissionGranted && (
                <Button size="sm" onClick={requestPermission}>
                  Grant Permission
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{translate('theme')}</div>
              <div className="text-xs text-muted-foreground">Choose appearance preference</div>
            </div>
            <Select value={theme} onValueChange={(v) => setTheme(v as typeof theme)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">{translate('system')}</SelectItem>
                <SelectItem value="light">{translate('light')}</SelectItem>
                <SelectItem value="dark">{translate('dark')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{translate('language')}</div>
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
              <div className="text-sm font-medium">{translate('temperatureUnit')}</div>
              <div className="text-xs text-muted-foreground">Show temperature in Celsius or Fahrenheit</div>
            </div>
            <Select value={temperatureUnit} onValueChange={(v) => setTemperatureUnit(v as 'C' | 'F')}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C">{translate('celsius')}</SelectItem>
                <SelectItem value="F">{translate('fahrenheit')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{translate('windUnit')}</div>
              <div className="text-xs text-muted-foreground">Show wind speed in km/h or mph</div>
            </div>
            <Select value={windUnit} onValueChange={(v) => setWindUnit(v as 'km/h' | 'mph')}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km/h">{translate('kmh')}</SelectItem>
                <SelectItem value="mph">{translate('mph')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{translate('dataSaver')}</div>
              <div className="text-xs text-muted-foreground">Reduce data usage and background fetching</div>
            </div>
            <Switch checked={dataSaver} onCheckedChange={setDataSaver} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(state.preferences.categories).map(([category, enabled]) => (
            <div key={category} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium capitalize">
                  {category.replace('_', ' ')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {category === 'weather' && 'Weather alerts and forecasts'}
                  {category === 'pests_diseases' && 'Pest and disease detection alerts'}
                  {category === 'irrigation' && 'Irrigation reminders and schedules'}
                  {category === 'harvest' && 'Harvest timing and readiness alerts'}
                  {category === 'market' && 'Market prices and trading alerts'}
                  {category === 'crop_management' && 'Crop health and soil condition alerts'}
                  {category === 'equipment' && 'Equipment maintenance and malfunction alerts'}
                  {category === 'government' && 'Government schemes and policy updates'}
                  {category === 'system' && 'General system notifications'}
                </div>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) => 
                  updatePreferences({
                    categories: {
                      ...state.preferences.categories,
                      [category]: checked
                    }
                  })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Priority</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(state.preferences.priority).map(([priority, enabled]) => (
            <div key={priority} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium capitalize">{priority}</div>
                <div className="text-xs text-muted-foreground">
                  {priority === 'urgent' && 'Critical alerts requiring immediate attention'}
                  {priority === 'high' && 'Important alerts for farming operations'}
                  {priority === 'medium' && 'Regular updates and reminders'}
                  {priority === 'low' && 'Informational updates and general news'}
                </div>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) => 
                  updatePreferences({
                    priority: {
                      ...state.preferences.priority,
                      [priority]: checked
                    }
                  })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Interface</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{translate('compactMode')}</div>
              <div className="text-xs text-muted-foreground">Denser layout with smaller paddings</div>
            </div>
            <Switch checked={compactMode} onCheckedChange={setCompactMode} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{translate('defaultLanding')}</div>
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


