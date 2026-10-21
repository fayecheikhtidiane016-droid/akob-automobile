import { NextResponse } from 'next/server';
import { startGithubAdminSession, verifyAdminPassword } from '@/lib/github-catalog';

export async function POST(request: Request) {
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPOSITORY || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 16) {
    return NextResponse.json({ error: 'La gestion GitHub n’est pas configurée.' }, { status: 503 });
  }
  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  if (!verifyAdminPassword(body?.password)) {
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 });
  }
  await startGithubAdminSession();
  return NextResponse.json({ ok: true });
}
