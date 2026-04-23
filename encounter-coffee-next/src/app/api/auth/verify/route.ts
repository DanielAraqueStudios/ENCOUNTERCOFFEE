import { NextRequest, NextResponse } from 'next/server';
import { verifySession, getTokenFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
  return NextResponse.json({ valid: true });
}
