import { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useLanguage } from './language-provider'
import { Bell, Settings, User, Globe } from 'lucide-react'

export function Header() {
  const { currentLanguage, setLanguage, languages } = useLanguage()
  const [notifications] = useState(3)

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl">Smart Crop Advisory System</h2>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Online
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={currentLanguage.code} 
              onValueChange={(value) => {
                const language = languages.find(l => l.code === value)
                if (language) setLanguage(language)
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span>{currentLanguage.flag}</span>
                    <span className="text-sm">{currentLanguage.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    <div className="flex items-center gap-2">
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}