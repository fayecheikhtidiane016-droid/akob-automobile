import { NextResponse } from 'next/server';
import { z } from 'zod';

const reservationSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal('')),
  vehicle: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
  pickupLocation: z.string().min(2),
  returnLocation: z.string().min(2),
  notes: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = reservationSchema.parse(payload);

    return NextResponse.json({
      success: true,
      message: 'Demande reçue. L’agence la validéera avant confirmation.',
      data
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erreur de validation. Vérifiez les informations du formulaire.' },
      { status: 400 }
    );
  }
}
