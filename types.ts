export type Page = 
  | 'dashboard'
  | 'guide'
  | 'alerts'
  | 'shelters'
  | 'volunteer'
  | 'contacts'
  | 'map'
  | 'report'
  | 'profile'
  | 'mesh';

export interface Alert {
  id: number;
  type: string;
  area: string;
  severity: 'High' | 'Medium' | 'Low';
  message: string;
  time: string;
  image?: string;
}

export enum DisasterType {
  Earthquake = 'Earthquake',
  Flood = 'Flood',
  Cyclone = 'Cyclone',
  Landslide = 'Landslide',
  Heatwave = 'Heatwave',
  Tsunami = 'Tsunami',
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface PersonalContact {
  id?: number;
  name: string;
  number: string;
}

export interface UserProfile {
  id: number;
  name: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
}

export interface Shelter {
  id: number;
  name: string;
  location: string; // City name
  distance: string; // This can be calculated dynamically in a real app
  capacity: number;
  available: number;
  lat: number;
  lng: number;
}

export interface SurvivalGuideCache {
  disasterType: DisasterType;
  guide: string;
  timestamp: Date;
}

export interface MeshPeer {
  id: string;
  name: string;
  status: 'offline' | 'online-gateway';
  signal: number;
}
