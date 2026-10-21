CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'assistant' CHECK (role IN ('owner', 'assistant', 'developer')),
  can_manage_vehicles BOOLEAN DEFAULT TRUE,
  can_manage_reservations BOOLEAN DEFAULT TRUE,
  can_manage_accounts BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  daily_price NUMERIC(12,2) DEFAULT 0,
  sale_price NUMERIC(12,2) DEFAULT 0,
  mileage INTEGER NOT NULL DEFAULT 0,
  fuel TEXT,
  transmission TEXT,
  seats INTEGER,
  category TEXT NOT NULL,
  color TEXT,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  ad_type TEXT NOT NULL CHECK (ad_type IN ('rent', 'sale', 'both')),
  status TEXT NOT NULL CHECK (status IN ('available', 'reserved', 'rented', 'sold', 'unavailable')),
  published BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS vehicle_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  pickup_location TEXT,
  return_location TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'refused', 'cancelled')) DEFAULT 'pending',
  total_estimate NUMERIC(12,2) DEFAULT 0,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agency_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name TEXT,
  whatsapp_number TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  linkedin_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_ad_type ON vehicles(ad_type);
CREATE INDEX idx_reservations_vehicle_id ON reservations(vehicle_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_vehicle_photos_vehicle_id ON vehicle_photos(vehicle_id);
