import { AgencyProfile, Reservation, Vehicle } from '@/lib/types';

export const agency: AgencyProfile = {
  name: 'Akob Automobile',
  slogan: 'Mobilité premium',
  email: 'contact@akobautomobile.com',
  phone: 'À configurer',
  address: 'À configurer',
  whatsappNumber: '',
  instagramUrl: '#',
  facebookUrl: '#',
  linkedinUrl: '#'
};

export const vehicles: Vehicle[] = [
  {
    id: 'veh-001',
    slug: 'mercedes-glc-300',
    brand: 'Mercedes',
    model: 'GLC 300',
    title: 'Mercedes GLC 300 Premium',
    year: 2023,
    dailyPrice: 220000,
    salePrice: 36500000,
    mileage: 18000,
    fuel: 'Essence',
    transmission: 'Automatique',
    seats: 5,
    category: 'SUV',
    color: 'Noir',
    description: 'Un SUV premium élégant, confortable et idéal pour les déplacements urbains comme les longs trajets.',
    features: ['Climatisation automatique', 'Caméra de recul', 'Bluetooth', 'Sièges chauffants'],
    adType: 'both',
    status: 'available',
    availability: 'available',
    gallery: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=900&q=80'
    ],
    featured: true,
    createdAt: '2025-01-10',
    updatedAt: '2025-01-20'
  },
  {
    id: 'veh-002',
    slug: 'toyota-land-cruiser-prado',
    brand: 'Toyota',
    model: 'Land Cruiser Prado',
    title: 'Toyota Land Cruiser Prado 2022',
    year: 2022,
    dailyPrice: 260000,
    salePrice: 42000000,
    mileage: 26000,
    fuel: 'Diesel',
    transmission: 'Automatique',
    seats: 7,
    category: 'SUV',
    color: 'Blanc',
    description: 'Robuste, spacieux et performant, parfait pour les familles et les voyages longue distance.',
    features: ['Quatre roues motrices', 'Système audio premium', 'Toit ouvrant', 'Volant chauffant'],
    adType: 'both',
    status: 'reserved',
    availability: 'limited',
    gallery: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80'
    ],
    featured: true,
    createdAt: '2025-01-08',
    updatedAt: '2025-01-18'
  },
  {
    id: 'veh-003',
    slug: 'peugeot-508-sw',
    brand: 'Peugeot',
    model: '508 SW',
    title: 'Peugeot 508 SW Premium',
    year: 2021,
    dailyPrice: 180000,
    salePrice: 25000000,
    mileage: 34000,
    fuel: 'Essence',
    transmission: 'Automatique',
    seats: 5,
    category: 'Berline',
    color: 'Gris',
    description: 'Une berline élégante pour ceux qui recherchent confort, sobriété et performance au quotidien.',
    features: ['Assistances avancées', 'Écran tactile', 'Bluetooth', 'Feux LED'],
    adType: 'both',
    status: 'available',
    availability: 'available',
    gallery: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80'
    ],
    featured: true,
    createdAt: '2025-01-05',
    updatedAt: '2025-01-15'
  },
  {
    id: 'veh-004',
    slug: 'range-rover-sport',
    brand: 'Range Rover',
    model: 'Sport',
    title: 'Range Rover Sport HSE',
    year: 2024,
    dailyPrice: 310000,
    salePrice: 49000000,
    mileage: 12000,
    fuel: 'Diesel',
    transmission: 'Automatique',
    seats: 5,
    category: 'SUV',
    color: 'Noir',
    description: 'Un SUV de luxe offrant un niveau de confort incomparable et un design haut de gamme.',
    features: ['Phares Matrix', 'Toit panoramique', 'Sièges électriques', 'Navigation premium'],
    adType: 'sale',
    status: 'available',
    availability: 'available',
    gallery: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80'
    ],
    featured: false,
    createdAt: '2025-01-02',
    updatedAt: '2025-01-12'
  }
];

export const testimonials = [
  { name: 'Mamadou D.', role: 'Chef d’entreprise', quote: 'Service rapide, voiture impeccable et conseils très professionnels.' },
  { name: 'Awa B.', role: 'Particulier', quote: 'Le processus de réservation est clair et la voiture était en parfait état.' },
  { name: 'Koffi T.', role: 'Consultant', quote: 'Le rapport qualité-prix est excellent et l’équipe est très à l’écoute.' }
];

export const reservations: Reservation[] = [
  { id: 'res-001', client: 'Nadia K.', phone: '+225 05 00 00 00', vehicleTitle: 'Mercedes GLC 300', dates: '12-15 janvier', status: 'pending', amount: 660000 },
  { id: 'res-002', client: 'Soro M.', phone: '+225 07 00 00 00', vehicleTitle: 'Toyota Land Cruiser Prado', dates: '20-25 janvier', status: 'accepted', amount: 1300000 },
  { id: 'res-003', client: 'Armand F.', phone: '+225 01 00 00 00', vehicleTitle: 'Peugeot 508 SW', dates: '02-08 février', status: 'refused', amount: 1260000 }
];

export const getFeaturedVehicles = () => vehicles.filter((vehicle) => vehicle.featured);
export const getVehicleBySlug = (slug: string) => vehicles.find((vehicle) => vehicle.slug === slug);
