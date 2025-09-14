import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { useNotifications } from '../contexts/NotificationContext'
import { useLanguage } from './language-provider'
import { 
  Bell, 
  BellOff, 
  Settings, 
  Filter, 
  Search, 
  X, 
  Check, 
  Trash2, 
  MoreVertical,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  getNotificationIcon,
  getPriorityColor,
  getPriorityBgColor,
  getCategoryColor,
  formatNotificationTime,
  NotificationCategory,
  NotificationType,
  NotificationPreferences
} from '../lib/notifications'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { translate } = useLanguage()
  const { 
    state, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications,
    updatePreferences,
    requestPermission
  } = useNotifications()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [showSettings, setShowSettings] = useState(false)

  // Filter notifications based on search and filters
  const filteredNotifications = useMemo(() => {
    let filtered = state.notifications

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(notification => notification.category === filterCategory)
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(notification => notification.priority === filterPriority)
    }

    return filtered
  }, [state.notifications, searchQuery, filterCategory, filterPriority])

  const unreadNotifications = filteredNotifications.filter(n => !n.read)
  const readNotifications = filteredNotifications.filter(n => n.read)

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id)
  }

  const handleClearAll = () => {
    clearAllNotifications()
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const handleUpdatePreferences = (updates: Partial<NotificationPreferences>) => {
    updatePreferences({ ...state.preferences, ...updates })
  }

  const handleRequestPermission = async () => {
    await requestPermission()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end p-2">
      <Card className="w-80 max-w-sm h-[70vh] flex flex-col shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <CardTitle className="text-lg">Notifications</CardTitle>
            {state.unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                {state.unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-3 px-4 pb-4">
          {showSettings ? (
            <NotificationSettings 
              preferences={state.preferences}
              onUpdate={handleUpdatePreferences}
              onRequestPermission={handleRequestPermission}
              isPermissionGranted={state.isPermissionGranted}
            />
          ) : (
            <>
              {/* Search and Filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2  top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="     Search Notifications"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 h-8 text-sm "
                  />
                </div>

                <div className="flex gap-1">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="flex-1 h-8 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="weather">Weather</SelectItem>
                      <SelectItem value="pests_diseases">Pests & Diseases</SelectItem>
                      <SelectItem value="irrigation">Irrigation</SelectItem>
                      <SelectItem value="harvest">Harvest</SelectItem>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="crop_management">Crop Management</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="flex-1 h-8 text-xs">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadNotifications.length === 0}
                  className="h-7 text-xs px-2"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark All Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={state.notifications.length === 0}
                  className="h-7 text-xs px-2"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              </div>

              {/* Notifications List */}
              <ScrollArea className="flex-1">
                <Tabs defaultValue="unread" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-8">
                    <TabsTrigger value="unread" className="text-xs">
                      Unread ({unreadNotifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="all" className="text-xs">
                      All ({filteredNotifications.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="unread" className="space-y-1 mt-3">
                    {unreadNotifications.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <BellOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No unread notifications</p>
                      </div>
                    ) : (
                      unreadNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                          onDelete={handleDeleteNotification}
                        />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="all" className="space-y-1 mt-3">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <BellOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications found</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                          onDelete={handleDeleteNotification}
                        />
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface NotificationItemProps {
  notification: any
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`p-2 rounded-md border transition-all duration-200 ${
        notification.read 
          ? 'bg-muted/30 border-border' 
          : 'bg-background border-primary/20 shadow-sm'
      } ${isHovered ? 'shadow-md' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-2">
        <div className="text-lg flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-xs ${notification.read ? 'text-muted-foreground' : ''}`}>
                {notification.title}
              </h4>
              <p className={`text-xs text-muted-foreground mt-0.5 line-clamp-2`}>
                {notification.message}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              <Badge 
                variant="outline" 
                className={`text-xs px-1 py-0 ${getPriorityBgColor(notification.priority)} ${getPriorityColor(notification.priority)}`}
              >
                {notification.priority}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!notification.read && (
                    <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                      <Check className="h-3 w-3 mr-2" />
                      Mark as Read
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onDelete(notification.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs px-1 py-0">
                {notification.category.replace('_', ' ')}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatNotificationTime(notification.timestamp)}
              </span>
            </div>
            
            {!notification.read && (
              <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface NotificationSettingsProps {
  preferences: NotificationPreferences
  onUpdate: (updates: Partial<NotificationPreferences>) => void
  onRequestPermission: () => Promise<void>
  isPermissionGranted: boolean
}

function NotificationSettings({ 
  preferences, 
  onUpdate, 
  onRequestPermission, 
  isPermissionGranted 
}: NotificationSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm">Notification Settings</h3>
          <p className="text-xs text-muted-foreground">
            Manage your notification preferences
          </p>
        </div>
      </div>

      <Separator />

      {/* General Settings */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">General</h4>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs">Enable Notifications</Label>
            <p className="text-xs text-muted-foreground">
              Turn notifications on or off
            </p>
          </div>
          <Switch
            checked={preferences.enabled}
            onCheckedChange={(checked) => onUpdate({ enabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs">Browser Notifications</Label>
            <p className="text-xs text-muted-foreground">
              Show desktop notifications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={preferences.channels.browser}
              onCheckedChange={(checked) => 
                onUpdate({ 
                  channels: { ...preferences.channels, browser: checked } 
                })
              }
              disabled={!isPermissionGranted}
            />
            {!isPermissionGranted && (
              <Button size="sm" onClick={onRequestPermission} className="h-6 text-xs px-2">
                Grant Permission
              </Button>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Categories</h4>
        <div className="space-y-2">
          {Object.entries(preferences.categories).map(([category, enabled]) => (
            <div key={category} className="flex items-center justify-between">
              <Label className="capitalize text-xs">
                {category.replace('_', ' ')}
              </Label>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) => 
                  onUpdate({
                    categories: {
                      ...preferences.categories,
                      [category]: checked
                    }
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Priority Settings */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Priority Levels</h4>
        <div className="space-y-2">
          {Object.entries(preferences.priority).map(([priority, enabled]) => (
            <div key={priority} className="flex items-center justify-between">
              <Label className="capitalize text-xs">{priority}</Label>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) => 
                  onUpdate({
                    priority: {
                      ...preferences.priority,
                      [priority]: checked
                    }
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

    </div>
  )
}
