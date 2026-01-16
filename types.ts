export enum ScanStatus {
  HALAL = 'HALAL',
  DOUBTFUL = 'DOUBTFUL',
  HARAM = 'HARAM',
  LOADING = 'LOADING',
  IDLE = 'IDLE'
}

export interface ProductAnalysis {
  productName: string;
  status: ScanStatus;
  confidenceScore: number;
  reason: string;
  scholarNote: string;
  ingredients: string[];
  alternatives: string[];
  origin?: string;
  certification?: string;
}

export interface RestaurantAnalysis {
  restaurantName: string;
  isHalalCertifiedClaim: boolean;
  alcoholServed: boolean;
  crossContaminationRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  notes: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'WARNING' | 'INFO' | 'SUCCESS';
  date: string;
}

export interface PantryItem {
  id: string;
  name: string;
  status: ScanStatus;
  addedBy: string;
  date: string;
  expiryDate?: string; // ISO date string or simplified "2 days left"
}

export enum UserTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export type PlaceType = 'RESTAURANT' | 'STORE' | 'MOSQUE';

export interface Place {
  id: string;
  name: string;
  type: PlaceType;
  subtype: string;
  distance: string;
  rating: number;
  reviews: number;
  address: string;
  lat: number; 
  lng: number; 
  isOpen: boolean;
  certification?: string;
  popularDishes?: { name: string; rating: number }[];
  priceRange?: string;
  inventory?: { item: string; status: 'IN_STOCK' | 'OUT_OF_STOCK'; type: 'HALAL' | 'ZABIHA' }[];
  promotion?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'SUCCESS' | 'INFO';
  time: string;
  read: boolean;
  actionLabel?: string;
}

export interface Recipe {
  id: string;
  title: string;
  emoji: string;
  matchCount: number;
  totalIngredients: number;
  usedIngredients: string[];
  missingIngredients: string[];
}