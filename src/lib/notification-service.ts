// Notification service for generating agricultural notifications
import { 
  Notification, 
  NotificationType, 
  createNotification,
  NotificationCategory 
} from './notifications'

export class NotificationService {
  // Generate weather-related notifications
  static generateWeatherNotification(
    type: 'rain' | 'drought' | 'storm' | 'temperature' | 'wind',
    severity: 'low' | 'medium' | 'high' | 'urgent',
    location: string,
    details: any
  ): Notification {
    const templates = {
      rain: {
        title: 'Rain Alert',
        message: `Heavy rainfall expected in ${location}. ${details.amount}mm predicted.`,
        priority: severity === 'urgent' ? 'urgent' : severity === 'high' ? 'high' : 'medium'
      },
      drought: {
        title: 'Drought Warning',
        message: `Drought conditions detected in ${location}. Consider irrigation planning.`,
        priority: 'high'
      },
      storm: {
        title: 'Storm Alert',
        message: `Severe storm approaching ${location}. Take protective measures.`,
        priority: 'urgent'
      },
      temperature: {
        title: 'Temperature Alert',
        message: `Extreme temperature conditions in ${location}. ${details.temp}°C expected.`,
        priority: severity === 'urgent' ? 'urgent' : 'high'
      },
      wind: {
        title: 'Wind Alert',
        message: `Strong winds expected in ${location}. Wind speed: ${details.speed} km/h`,
        priority: 'medium'
      }
    }

    const template = templates[type]
    return createNotification('weather_alert', template.title, template.message, {
      priority: template.priority as any,
      category: 'weather',
      metadata: { location, details, type }
    })
  }

  // Generate pest and disease notifications
  static generatePestDiseaseNotification(
    type: 'pest' | 'disease',
    pestOrDisease: string,
    crop: string,
    severity: 'low' | 'medium' | 'high' | 'urgent',
    location: string,
    symptoms: string[]
  ): Notification {
    const notificationType = type === 'pest' ? 'pest_alert' : 'disease_alert'
    const title = type === 'pest' ? 'Pest Alert' : 'Disease Alert'
    const message = `${pestOrDisease} detected in ${crop} fields at ${location}. ${symptoms.length} symptoms identified.`

    return createNotification(notificationType as NotificationType, title, message, {
      priority: severity === 'urgent' ? 'urgent' : severity === 'high' ? 'high' : 'medium',
      category: 'pests_diseases',
      metadata: { pestOrDisease, crop, location, symptoms, type }
    })
  }

  // Generate irrigation notifications
  static generateIrrigationNotification(
    type: 'reminder' | 'schedule' | 'alert',
    field: string,
    crop: string,
    details: any
  ): Notification {
    const templates = {
      reminder: {
        title: 'Irrigation Reminder',
        message: `Time to irrigate ${crop} field: ${field}. Last irrigation: ${details.lastIrrigation}`,
        priority: 'medium'
      },
      schedule: {
        title: 'Irrigation Scheduled',
        message: `Irrigation scheduled for ${field} at ${details.time}. Duration: ${details.duration} minutes.`,
        priority: 'low'
      },
      alert: {
        title: 'Irrigation Alert',
        message: `Irrigation system issue detected in ${field}. ${details.issue}`,
        priority: 'high'
      }
    }

    const template = templates[type]
    return createNotification('irrigation_reminder', template.title, template.message, {
      priority: template.priority as any,
      category: 'irrigation',
      metadata: { field, crop, details, type }
    })
  }

  // Generate harvest notifications
  static generateHarvestNotification(
    type: 'ready' | 'schedule' | 'delay',
    crop: string,
    field: string,
    details: any
  ): Notification {
    const templates = {
      ready: {
        title: 'Harvest Ready',
        message: `${crop} in ${field} is ready for harvest. Optimal window: ${details.window}`,
        priority: 'high'
      },
      schedule: {
        title: 'Harvest Scheduled',
        message: `Harvest scheduled for ${crop} in ${field} on ${details.date} at ${details.time}`,
        priority: 'medium'
      },
      delay: {
        title: 'Harvest Delay',
        message: `Harvest delayed for ${crop} in ${field}. Reason: ${details.reason}`,
        priority: 'medium'
      }
    }

    const template = templates[type]
    return createNotification('harvest_reminder', template.title, template.message, {
      priority: template.priority as any,
      category: 'harvest',
      metadata: { crop, field, details, type }
    })
  }

  // Generate market notifications
  static generateMarketNotification(
    type: 'price_alert' | 'market_update' | 'trend',
    crop: string,
    details: any
  ): Notification {
    const templates = {
      price_alert: {
        title: 'Price Alert',
        message: `${crop} price reached ₹${details.price}/quintal. Target: ₹${details.target}`,
        priority: 'medium'
      },
      market_update: {
        title: 'Market Update',
        message: `New ${crop} prices available. Current: ₹${details.currentPrice}, Change: ${details.change}%`,
        priority: 'low'
      },
      trend: {
        title: 'Market Trend',
        message: `${crop} prices showing ${details.trend} trend. ${details.reason}`,
        priority: 'low'
      }
    }

    const template = templates[type]
    const notificationType = type === 'price_alert' ? 'price_alert' : 'market_update'
    return createNotification(notificationType as NotificationType, template.title, template.message, {
      priority: template.priority as any,
      category: 'market',
      metadata: { crop, details, type }
    })
  }

  // Generate crop health notifications
  static generateCropHealthNotification(
    type: 'assessment' | 'nutrient' | 'growth',
    crop: string,
    field: string,
    details: any
  ): Notification {
    const templates = {
      assessment: {
        title: 'Crop Health Assessment',
        message: `Health assessment completed for ${crop} in ${field}. Score: ${details.score}/10`,
        priority: 'medium'
      },
      nutrient: {
        title: 'Nutrient Alert',
        message: `${crop} in ${field} shows ${details.deficiency} deficiency. Consider ${details.recommendation}`,
        priority: 'high'
      },
      growth: {
        title: 'Growth Update',
        message: `${crop} in ${field} is ${details.stage}. Expected harvest: ${details.expectedHarvest}`,
        priority: 'low'
      }
    }

    const template = templates[type]
    return createNotification('crop_health', template.title, template.message, {
      priority: template.priority as any,
      category: 'crop_management',
      metadata: { crop, field, details, type }
    })
  }

  // Generate soil condition notifications
  static generateSoilNotification(
    type: 'moisture' | 'ph' | 'nutrients' | 'erosion',
    field: string,
    details: any
  ): Notification {
    const templates = {
      moisture: {
        title: 'Soil Moisture Alert',
        message: `Soil moisture in ${field} is ${details.level}%. ${details.recommendation}`,
        priority: 'medium'
      },
      ph: {
        title: 'Soil pH Alert',
        message: `Soil pH in ${field} is ${details.ph}. ${details.recommendation}`,
        priority: 'high'
      },
      nutrients: {
        title: 'Soil Nutrient Alert',
        message: `${field} soil shows ${details.nutrient} deficiency. Consider ${details.recommendation}`,
        priority: 'medium'
      },
      erosion: {
        title: 'Soil Erosion Warning',
        message: `Soil erosion detected in ${field}. ${details.recommendation}`,
        priority: 'high'
      }
    }

    const template = templates[type]
    return createNotification('soil_condition', template.title, template.message, {
      priority: template.priority as any,
      category: 'crop_management',
      metadata: { field, details, type }
    })
  }

  // Generate equipment notifications
  static generateEquipmentNotification(
    type: 'maintenance' | 'malfunction' | 'upgrade',
    equipment: string,
    details: any
  ): Notification {
    const templates = {
      maintenance: {
        title: 'Equipment Maintenance',
        message: `${equipment} maintenance due. Last service: ${details.lastService}`,
        priority: 'low'
      },
      malfunction: {
        title: 'Equipment Malfunction',
        message: `${equipment} malfunction detected. ${details.issue}`,
        priority: 'high'
      },
      upgrade: {
        title: 'Equipment Upgrade',
        message: `New ${equipment} upgrade available. ${details.features}`,
        priority: 'low'
      }
    }

    const template = templates[type]
    return createNotification('equipment_maintenance', template.title, template.message, {
      priority: template.priority as any,
      category: 'equipment',
      metadata: { equipment, details, type }
    })
  }

  // Generate government scheme notifications
  static generateGovernmentNotification(
    scheme: string,
    details: any
  ): Notification {
    return createNotification('government_scheme', 'New Government Scheme', 
      `${scheme} is now available. ${details.description}`, {
      priority: 'low',
      category: 'government',
      metadata: { scheme, details }
    })
  }

  // Generate sample notifications for demo
  static generateSampleNotifications(): Notification[] {
    const notifications: Notification[] = []

    // Weather notifications
    notifications.push(
      this.generateWeatherNotification('rain', 'high', 'Punjab', { amount: 85 }),
      this.generateWeatherNotification('temperature', 'urgent', 'Haryana', { temp: 45 }),
      this.generateWeatherNotification('storm', 'urgent', 'Gujarat', { speed: 120 })
    )

    // Pest and disease notifications
    notifications.push(
      this.generatePestDiseaseNotification('pest', 'Brown Plant Hopper', 'Rice', 'high', 'Punjab', 
        ['Yellowing leaves', 'Hopper burn', 'Stunted growth']),
      this.generatePestDiseaseNotification('disease', 'Bacterial Blight', 'Wheat', 'medium', 'Haryana',
        ['Water-soaked lesions', 'Yellow halos', 'Leaf wilting'])
    )

    // Irrigation notifications
    notifications.push(
      this.generateIrrigationNotification('reminder', 'Field A', 'Wheat', { lastIrrigation: '3 days ago' }),
      this.generateIrrigationNotification('schedule', 'Field B', 'Rice', { time: '6:00 AM', duration: 120 })
    )

    // Harvest notifications
    notifications.push(
      this.generateHarvestNotification('ready', 'Wheat', 'Field A', { window: 'Next 5 days' }),
      this.generateHarvestNotification('schedule', 'Rice', 'Field B', { date: '2025-01-15', time: '8:00 AM' })
    )

    // Market notifications
    notifications.push(
      this.generateMarketNotification('price_alert', 'Wheat', { price: 2500, target: 2400 }),
      this.generateMarketNotification('market_update', 'Rice', { currentPrice: 5500, change: 2.5 })
    )

    // Crop health notifications
    notifications.push(
      this.generateCropHealthNotification('assessment', 'Wheat', 'Field A', { score: 8 }),
      this.generateCropHealthNotification('nutrient', 'Rice', 'Field B', { 
        deficiency: 'Nitrogen', 
        recommendation: 'Apply urea fertilizer' 
      })
    )

    // Soil notifications
    notifications.push(
      this.generateSoilNotification('moisture', 'Field A', { level: 35, recommendation: 'Irrigate immediately' }),
      this.generateSoilNotification('ph', 'Field B', { ph: 5.2, recommendation: 'Apply lime to increase pH' })
    )

    // Equipment notifications
    notifications.push(
      this.generateEquipmentNotification('maintenance', 'Tractor', { lastService: '2 months ago' }),
      this.generateEquipmentNotification('malfunction', 'Irrigation Pump', { issue: 'Low pressure detected' })
    )

    // Government scheme notifications
    notifications.push(
      this.generateGovernmentNotification('PM-KISAN Scheme', { 
        description: 'Direct income support of ₹6000 per year for farmers' 
      })
    )

    return notifications
  }

  // Generate time-based notifications
  static generateTimeBasedNotifications(): Notification[] {
    const notifications: Notification[] = []
    const now = new Date()

    // Morning irrigation reminder
    if (now.getHours() >= 6 && now.getHours() < 8) {
      notifications.push(
        this.generateIrrigationNotification('reminder', 'Field A', 'Wheat', { lastIrrigation: 'Yesterday' })
      )
    }

    // Evening harvest reminder
    if (now.getHours() >= 17 && now.getHours() < 19) {
      notifications.push(
        this.generateHarvestNotification('ready', 'Rice', 'Field B', { window: 'Next 3 days' })
      )
    }

    // Weekly market update
    if (now.getDay() === 1) { // Monday
      notifications.push(
        this.generateMarketNotification('market_update', 'Wheat', { 
          currentPrice: 2450, 
          change: 1.2 
        })
      )
    }

    return notifications
  }
}
