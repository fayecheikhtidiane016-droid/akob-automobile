import { NextResponse } from 'next/server';
import { z } from 'zod';

const vehicleSchema = z.object({
  brand: z.string().min(2),
  model: z.string().min(2),
  year: z.number().min(1990),
  dailyPrice: z.number().min(0),
  salePrice: z.number().optional(),
  category: z.string().min(2),
  fuel: z.string().min(2),
  transmission: z.string().min(2),
  status: z.string().min(2),
  adType: z.enum(['rent', 'sale', 'both'])
});

export async function GET() {
  return NextResponse.json({
    message: 'API véhicules prête pour Supabase. Utiliser les variables d’environnement et les fonctions Supabase pour la persistance réelle.'
  });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = vehicleSchema.parse(payload);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Validation invalide' }, { status: 400 });
  }
}
