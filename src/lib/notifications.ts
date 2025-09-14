// Notification system for agricultural application
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: NotificationCategory
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, any>
  expiresAt?: Date
}

export type NotificationType = 
  | 'weather_alert'
  | 'pest_alert'
  | 'disease_alert'
  | 'irrigation_reminder'
  | 'harvest_reminder'
  | 'price_alert'
  | 'market_update'
  | 'crop_health'
  | 'soil_condition'
  | 'equipment_maintenance'
  | 'government_scheme'
  | 'general'

export type NotificationCategory = 
  | 'weather'
  | 'pests_diseases'
  | 'irrigation'
  | 'harvest'
  | 'market'
  | 'crop_management'
  | 'equipment'
  | 'government'
  | 'system'

export interface NotificationPreferences {
  enabled: boolean
  categories: {
    [K in NotificationCategory]: boolean
  }
  types: {
    [K in NotificationType]: boolean
  }
  priority: {
    low: boolean
    medium: boolean
    high: boolean
    urgent: boolean
  }
  channels: {
    inApp: boolean
    browser: boolean
    email: boolean
    sms: boolean
  }
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string // HH:MM format
  }
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
}

export interface NotificationTemplate {
  type: NotificationType
  title: string
  message: string
  priority: Notification['priority']
  category: NotificationCategory
  defaultEnabled: boolean
}

// Default notification templates
export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    type: 'weather_alert',
    title: 'Weather Alert',
    message: 'Severe weather conditions detected in your area',
    priority: 'high',
    category: 'weather',
    defaultEnabled: true
  },
  {
    type: 'pest_alert',
    title: 'Pest Alert',
    message: 'Pest infestation detected in your crops',
    priority: 'high',
    category: 'pests_diseases',
    defaultEnabled: true
  },
  {
    type: 'disease_alert',
    title: 'Disease Alert',
    message: 'Plant disease symptoms identified',
    priority: 'high',
    category: 'pests_diseases',
    defaultEnabled: true
  },
  {
    type: 'irrigation_reminder',
    title: 'Irrigation Reminder',
    message: 'Time to irrigate your fields',
    priority: 'medium',
    category: 'irrigation',
    defaultEnabled: true
  },
  {
    type: 'harvest_reminder',
    title: 'Harvest Reminder',
    message: 'Your crops are ready for harvest',
    priority: 'medium',
    category: 'harvest',
    defaultEnabled: true
  },
  {
    type: 'price_alert',
    title: 'Price Alert',
    message: 'Crop prices have reached your target',
    priority: 'medium',
    category: 'market',
    defaultEnabled: true
  },
  {
    type: 'market_update',
    title: 'Market Update',
    message: 'New market prices available',
    priority: 'low',
    category: 'market',
    defaultEnabled: true
  },
  {
    type: 'crop_health',
    title: 'Crop Health Update',
    message: 'Crop health assessment completed',
    priority: 'medium',
    category: 'crop_management',
    defaultEnabled: true
  },
  {
    type: 'soil_condition',
    title: 'Soil Condition Alert',
    message: 'Soil moisture/nutrient levels need attention',
    priority: 'medium',
    category: 'crop_management',
    defaultEnabled: true
  },
  {
    type: 'equipment_maintenance',
    title: 'Equipment Maintenance',
    message: 'Equipment maintenance due',
    priority: 'low',
    category: 'equipment',
    defaultEnabled: true
  },
  {
    type: 'government_scheme',
    title: 'Government Scheme',
    message: 'New government scheme available for farmers',
    priority: 'low',
    category: 'government',
    defaultEnabled: true
  },
  {
    type: 'general',
    title: 'General Notification',
    message: 'Important information for farmers',
    priority: 'low',
    category: 'system',
    defaultEnabled: true
  }
]

// Notification utility functions
export const createNotification = (
  type: NotificationType,
  title: string,
  message: string,
  options: Partial<Notification> = {}
): Notification => {
  const template = NOTIFICATION_TEMPLATES.find(t => t.type === type)
  
  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title: title || template?.title || 'Notification',
    message: message || template?.message || '',
    timestamp: new Date(),
    read: false,
    priority: template?.priority || 'medium',
    category: template?.category || 'system',
    ...options
  }
}

export const getNotificationIcon = (type: NotificationType): string => {
  const iconMap: Record<NotificationType, string> = {
    weather_alert: '🌦️',
    pest_alert: '🐛',
    disease_alert: '🦠',
    irrigation_reminder: '💧',
    harvest_reminder: '🌾',
    price_alert: '💰',
    market_update: '📈',
    crop_health: '🌱',
    soil_condition: '🌍',
    equipment_maintenance: '🔧',
    government_scheme: '🏛️',
    general: '📢'
  }
  return iconMap[type] || '📢'
}

export const getPriorityColor = (priority: Notification['priority']): string => {
  const colorMap: Record<Notification['priority'], string> = {
    low: 'text-gray-600',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    urgent: 'text-red-600'
  }
  return colorMap[priority]
}

export const getPriorityBgColor = (priority: Notification['priority']): string => {
  const colorMap: Record<Notification['priority'], string> = {
    low: 'bg-gray-100',
    medium: 'bg-blue-100',
    high: 'bg-orange-100',
    urgent: 'bg-red-100'
  }
  return colorMap[priority]
}

export const getCategoryColor = (category: NotificationCategory): string => {
  const colorMap: Record<NotificationCategory, string> = {
    weather: 'text-blue-600',
    pests_diseases: 'text-red-600',
    irrigation: 'text-cyan-600',
    harvest: 'text-green-600',
    market: 'text-purple-600',
    crop_management: 'text-emerald-600',
    equipment: 'text-gray-600',
    government: 'text-indigo-600',
    system: 'text-slate-600'
  }
  return colorMap[category]
}

export const formatNotificationTime = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return timestamp.toLocaleDateString()
}

export const shouldShowNotification = (
  notification: Notification,
  preferences: NotificationPreferences
): boolean => {
  // Check if notifications are enabled
  if (!preferences.enabled) return false

  // Check if category is enabled
  if (!preferences.categories[notification.category]) return false

  // Check if type is enabled
  if (!preferences.types[notification.type]) return false

  // Check if priority is enabled
  if (!preferences.priority[notification.priority]) return false

  // Check quiet hours
  if (preferences.quietHours && preferences.quietHours.enabled) {
    try {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes()
      
      if (preferences.quietHours.start && preferences.quietHours.end) {
        const startTime = parseInt(preferences.quietHours.start.split(':')[0]) * 60 + 
                         parseInt(preferences.quietHours.start.split(':')[1])
        const endTime = parseInt(preferences.quietHours.end.split(':')[0]) * 60 + 
                       parseInt(preferences.quietHours.end.split(':')[1])
        
        if (currentTime >= startTime && currentTime <= endTime) {
          // Only show urgent notifications during quiet hours
          return notification.priority === 'urgent'
        }
      }
    } catch (error) {
      console.warn('Error checking quiet hours:', error)
      // If there's an error with quiet hours, allow the notification
    }
  }

  // Check if notification has expired
  if (notification.expiresAt && notification.expiresAt < new Date()) {
    return false
  }

  return true
}

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  categories: {
    weather: true,
    pests_diseases: true,
    irrigation: true,
    harvest: true,
    market: true,
    crop_management: true,
    equipment: true,
    government: true,
    system: true
  },
  types: {
    weather_alert: true,
    pest_alert: true,
    disease_alert: true,
    irrigation_reminder: true,
    harvest_reminder: true,
    price_alert: true,
    market_update: true,
    crop_health: true,
    soil_condition: true,
    equipment_maintenance: true,
    government_scheme: true,
    general: true
  },
  priority: {
    low: true,
    medium: true,
    high: true,
    urgent: true
  },
  channels: {
    inApp: true,
    browser: true,
    email: false,
    sms: false
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '06:00'
  },
  frequency: 'immediate'
}

// Browser notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    console.warn('Notification permission denied')
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export const showBrowserNotification = (
  notification: Notification,
  preferences: NotificationPreferences
): void => {
  if (!preferences.channels.browser) return

  if (Notification.permission === 'granted') {
    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'urgent',
      silent: notification.priority === 'low'
    })

    // Auto-close after 5 seconds for non-urgent notifications
    if (notification.priority !== 'urgent') {
      setTimeout(() => {
        browserNotification.close()
      }, 5000)
    }

    browserNotification.onclick = () => {
      window.focus()
      browserNotification.close()
    }
  }
}

// Local storage helpers
export const saveNotificationPreferences = (preferences: NotificationPreferences): void => {
  try {
    localStorage.setItem('agriai-notification-preferences', JSON.stringify(preferences))
  } catch (error) {
    console.error('Failed to save notification preferences:', error)
  }
}

export const loadNotificationPreferences = (): NotificationPreferences => {
  try {
    const saved = localStorage.getItem('agriai-notification-preferences')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Merge with defaults to handle new preferences
      return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...parsed }
    }
  } catch (error) {
    console.error('Failed to load notification preferences:', error)
  }
  return DEFAULT_NOTIFICATION_PREFERENCES
}

export const saveNotifications = (notifications: Notification[]): void => {
  try {
    localStorage.setItem('agriai-notifications', JSON.stringify(notifications))
  } catch (error) {
    console.error('Failed to save notifications:', error)
  }
}

export const loadNotifications = (): Notification[] => {
  try {
    const saved = localStorage.getItem('agriai-notifications')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Convert timestamp strings back to Date objects
      return parsed.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
        expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
      }))
    }
  } catch (error) {
    console.error('Failed to load notifications:', error)
  }
  return []
}
