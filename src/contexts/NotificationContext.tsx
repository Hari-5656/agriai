import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { 
  Notification, 
  NotificationPreferences, 
  createNotification,
  saveNotificationPreferences,
  loadNotificationPreferences,
  saveNotifications,
  loadNotifications,
  showBrowserNotification,
  shouldShowNotification,
  requestNotificationPermission,
  DEFAULT_NOTIFICATION_PREFERENCES
} from '../lib/notifications'

interface NotificationState {
  notifications: Notification[]
  preferences: NotificationPreferences
  unreadCount: number
  isPermissionGranted: boolean
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'UPDATE_PREFERENCES'; payload: NotificationPreferences }
  | { type: 'LOAD_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_PERMISSION_GRANTED'; payload: boolean }

const initialState: NotificationState = {
  notifications: [],
  preferences: DEFAULT_NOTIFICATION_PREFERENCES,
  unreadCount: 0,
  isPermissionGranted: false
}

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications]
      const newUnreadCount = state.unreadCount + (action.payload.read ? 0 : 1)
      saveNotifications(newNotifications)
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newUnreadCount
      }

    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === action.payload
          ? { ...notification, read: true }
          : notification
      )
      const updatedUnreadCount = Math.max(0, state.unreadCount - 1)
      saveNotifications(updatedNotifications)
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedUnreadCount
      }

    case 'MARK_ALL_AS_READ':
      const allReadNotifications = state.notifications.map(notification => ({
        ...notification,
        read: true
      }))
      saveNotifications(allReadNotifications)
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0
      }

    case 'DELETE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
      const filteredUnreadCount = state.notifications.find(n => n.id === action.payload && !n.read)
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount
      saveNotifications(filteredNotifications)
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredUnreadCount
      }

    case 'CLEAR_ALL_NOTIFICATIONS':
      saveNotifications([])
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      }

    case 'UPDATE_PREFERENCES':
      // Ensure quietHours is properly initialized
      const safePreferences = {
        ...action.payload,
        quietHours: action.payload.quietHours || {
          enabled: false,
          start: '22:00',
          end: '06:00'
        }
      }
      saveNotificationPreferences(safePreferences)
      return {
        ...state,
        preferences: safePreferences
      }

    case 'LOAD_NOTIFICATIONS':
      const loadedNotifications = action.payload
      const unreadCount = loadedNotifications.filter(n => !n.read).length
      return {
        ...state,
        notifications: loadedNotifications,
        unreadCount
      }

    case 'SET_PERMISSION_GRANTED':
      return {
        ...state,
        isPermissionGranted: action.payload
      }

    default:
      return state
  }
}

interface NotificationContextType {
  state: NotificationState
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAllNotifications: () => void
  updatePreferences: (preferences: NotificationPreferences) => void
  requestPermission: () => Promise<boolean>
  getNotificationsByCategory: (category: string) => Notification[]
  getNotificationsByType: (type: string) => Notification[]
  getUnreadNotifications: () => Notification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  // Load notifications and preferences on mount
  useEffect(() => {
    const savedNotifications = loadNotifications()
    const savedPreferences = loadNotificationPreferences()
    
    // Ensure quietHours is properly initialized
    const safePreferences = {
      ...savedPreferences,
      quietHours: savedPreferences.quietHours || {
        enabled: false,
        start: '22:00',
        end: '06:00'
      }
    }
    
    dispatch({ type: 'LOAD_NOTIFICATIONS', payload: savedNotifications })
    dispatch({ type: 'UPDATE_PREFERENCES', payload: safePreferences })

    // Request notification permission
    requestNotificationPermission().then(granted => {
      dispatch({ type: 'SET_PERMISSION_GRANTED', payload: granted })
    })
  }, [])

  // Clean up expired notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const validNotifications = state.notifications.filter(notification => 
        !notification.expiresAt || notification.expiresAt > now
      )
      
      if (validNotifications.length !== state.notifications.length) {
        dispatch({ type: 'LOAD_NOTIFICATIONS', payload: validNotifications })
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [state.notifications])

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification = createNotification(
      notificationData.type,
      notificationData.title,
      notificationData.message,
      notificationData
    )

    // Check if notification should be shown based on preferences
    if (shouldShowNotification(notification, state.preferences)) {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification })

      // Show browser notification if enabled
      if (state.preferences.channels.browser && state.isPermissionGranted) {
        showBrowserNotification(notification, state.preferences)
      }
    }
  }, [state.preferences, state.isPermissionGranted])

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id })
  }, [])

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_AS_READ' })
  }, [])

  const deleteNotification = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id })
  }, [])

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' })
  }, [])

  const updatePreferences = useCallback((preferences: NotificationPreferences) => {
    // Ensure quietHours is properly initialized
    const safePreferences = {
      ...preferences,
      quietHours: preferences.quietHours || {
        enabled: false,
        start: '22:00',
        end: '06:00'
      }
    }
    dispatch({ type: 'UPDATE_PREFERENCES', payload: safePreferences })
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await requestNotificationPermission()
    dispatch({ type: 'SET_PERMISSION_GRANTED', payload: granted })
    return granted
  }, [])

  const getNotificationsByCategory = useCallback((category: string) => {
    return state.notifications.filter(notification => notification.category === category)
  }, [state.notifications])

  const getNotificationsByType = useCallback((type: string) => {
    return state.notifications.filter(notification => notification.type === type)
  }, [state.notifications])

  const getUnreadNotifications = useCallback(() => {
    return state.notifications.filter(notification => !notification.read)
  }, [state.notifications])

  const value: NotificationContextType = {
    state,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
    requestPermission,
    getNotificationsByCategory,
    getNotificationsByType,
    getUnreadNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
