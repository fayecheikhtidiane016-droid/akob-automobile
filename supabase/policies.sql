ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public vehicles are readable" ON vehicles
FOR SELECT USING (published = true);

CREATE POLICY "Authenticated admins can manage vehicles" ON vehicles
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated admins can update vehicles" ON vehicles
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated admins can delete vehicles" ON vehicles
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Public vehicle photos are readable" ON vehicle_photos
FOR SELECT USING (true);

CREATE POLICY "Authenticated admins can manage photos" ON vehicle_photos
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Clients can create reservations" ON reservations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Authorized staff can view reservations" ON reservations
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authorized staff can update reservations" ON reservations
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Agency settings readable publicly" ON agency_settings
FOR SELECT USING (true);

CREATE POLICY "Authorized admins modify agency settings" ON agency_settings
FOR UPDATE USING (auth.role() = 'authenticated');
