import { NextResponse } from 'next/server';
import { clearGithubAdminSession } from '@/lib/github-catalog';

export async function POST() {
  await clearGithubAdminSession();
  return NextResponse.json({ ok: true });
}
