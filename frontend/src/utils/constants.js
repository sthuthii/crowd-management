// ============================================
// CROWD DENSITY SETTINGS
// ============================================
export const CROWD_DENSITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const CROWD_THRESHOLDS = {
  LOW: 0.3,      // 30% capacity = low density
  MEDIUM: 0.7,   // 70% capacity = medium density
  HIGH: 0.9      // 90% capacity = high density
};

// ============================================
// QUEUE STATUS TYPES
// ============================================
export const QUEUE_STATUS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high'
};

// ============================================
// ALERT TYPES
// ============================================
export const ALERT_TYPES = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info'
};

// ============================================
// SHUTTLE/BUS STATUS
// ============================================
export const SHUTTLE_STATUS = {
  ACTIVE: 'active',
  LOADING: 'loading',
  OFFLINE: 'offline'
};

// ============================================
// TEMPLE TIMINGS (24-hour format)
// ============================================
export const TEMPLE_TIMINGS = {
  MORNING_START: '06:00',
  MORNING_END: '12:00',
  EVENING_START: '16:00',
  EVENING_END: '21:00',
  SPECIAL_POOJA_START: '19:00',
  SPECIAL_POOJA_END: '20:00',
  AARTI_TIME: '20:30'
};

// ============================================
// FACILITY TYPES
// ============================================
export const FACILITY_TYPES = {
  RESTROOM: 'restroom',
  WATER_STATION: 'water_station',
  MEDICAL_AID: 'medical_aid',
  LOST_AND_FOUND: 'lost_and_found',
  PRASAD_SHOP: 'prasad_shop',
  PARKING: 'parking',
  FOOD_COURT: 'food_court'
};

// ============================================
// EMERGENCY CONTACT NUMBERS
// ============================================
export const EMERGENCY_CONTACTS = {
  MEDICAL: '108',
  SECURITY: '+91-9876543210',
  TEMPLE_INFO: '+91-9876543211',
  LOST_FOUND: '+91-9876543212'
};

// ============================================
// ZONE CAPACITY LIMITS (maximum visitors)
// ============================================
export const ZONE_CAPACITY = {
  MAIN_TEMPLE: 5000,
  QUEUE_AREA: 4000,
  PARKING: 2000,
  FOOD_COURT: 1500
};

// ============================================
// PARKING LEVELS
// ============================================
export const PARKING_LEVELS = [
  'Ground Floor',
  'Basement 1',
  'Basement 2',
  'Basement 3'
];

// ============================================
// QUEUE TYPES
// ============================================
export const QUEUE_TYPES = {
  GENERAL: 'general',
  VIP: 'vip',
  PRASAD: 'prasad',
  SPECIAL: 'special'
};

// ============================================
// ACCESSIBILITY SERVICE TYPES
// ============================================
export const ACCESSIBILITY_SERVICES = {
  WHEELCHAIR: 'wheelchair',
  GUIDE: 'guide',
  PRIORITY_QUEUE: 'priority_queue',
  PARKING: 'accessible_parking',
  AUDIO_GUIDE: 'audio_guide'
};

// ============================================
// CHART COLORS (for graphs and visualizations)
// ============================================
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',    // Blue
  SECONDARY: '#f59e0b',  // Orange
  SUCCESS: '#10b981',    // Green
  DANGER: '#ef4444',     // Red
  WARNING: '#f59e0b',    // Yellow/Orange
  INFO: '#6b7280'        // Gray
};

// ============================================
// API REFRESH INTERVALS (milliseconds)
// ============================================
export const REFRESH_INTERVALS = {
  CROWD_DATA: 5000,        // Update every 5 seconds
  QUEUE_STATUS: 10000,     // Update every 10 seconds
  PARKING_STATUS: 15000,   // Update every 15 seconds
  SHUTTLE_TRACKING: 5000,  // Update every 5 seconds
  ALERTS: 3000             // Update every 3 seconds
};

// ============================================
// MAXIMUM CAPACITIES
// ============================================
export const MAX_CAPACITY = {
  TOTAL_TEMPLE: 16000,
  SINGLE_ZONE: 5000,
  PARKING_TOTAL: 1100
};

// Export everything as default too
export default {
  CROWD_DENSITY,
  CROWD_THRESHOLDS,
  QUEUE_STATUS,
  ALERT_TYPES,
  SHUTTLE_STATUS,
  TEMPLE_TIMINGS,
  FACILITY_TYPES,
  EMERGENCY_CONTACTS,
  ZONE_CAPACITY,
  PARKING_LEVELS,
  QUEUE_TYPES,
  ACCESSIBILITY_SERVICES,
  CHART_COLORS,
  REFRESH_INTERVALS,
  MAX_CAPACITY
};