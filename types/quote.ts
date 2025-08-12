export interface Quote {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory;
}

export type QuoteCategory = 'motivation' | 'love' | 'humour' | 'fitness' | 'success' | 'friendship';

export interface NotificationSettings {
  enabled: boolean;
  dailyCount: number;
  categories: QuoteCategory[];
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  label: string;
}

export interface UserPreferences {
  favorites: string[];
  notificationSettings: NotificationSettings;
  lastViewedCategory: QuoteCategory;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
}