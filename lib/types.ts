export type AdType = 'rent' | 'sale' | 'both';
export type VehicleStatus = 'available' | 'reserved' | 'rented' | 'sold' | 'unavailable';

export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  title: string;
  year: number;
  dailyPrice: number;
  salePrice: number | null;
  mileage: number;
  fuel: string;
  transmission: string;
  seats: number;
  category: string;
  color: string;
  description: string;
  features: string[];
  adType: AdType;
  status: VehicleStatus;
  availability: 'available' | 'limited' | 'sold';
  gallery: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  client: string;
  phone: string;
  vehicleTitle: string;
  dates: string;
  status: 'pending' | 'accepted' | 'refused';
  amount: number;
}

export interface AgencyProfile {
  name: string;
  slogan: string;
  email: string;
  phone: string;
  address: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
}
