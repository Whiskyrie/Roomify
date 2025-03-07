export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: 'apartment' | 'house' | 'studio' | 'condominium' | string;
  price: number;
  priceType: 'monthly' | 'daily' | string;
  location: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  images: string[];
  amenities?: string[]; // Ex: ['Wi-Fi', 'Piscina', 'Academia', etc]
  rules?: string[]; // Ex: ['Não é permitido fumar', 'Não é permitido animais', etc]
  available: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    memberSince: string;
    avatar?: string;
  };
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  location?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  bedrooms?: string | number;
  bathrooms?: string | number;
  propertyType?: string;
}

export interface PropertyState {
  properties: Property[];
  currentProperty: Property | null;
  loading: boolean;
  error: string | null;
  total: number;
}