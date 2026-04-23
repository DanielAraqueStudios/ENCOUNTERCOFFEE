import { NextRequest, NextResponse } from 'next/server';
import { deleteSession, getTokenFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (token) deleteSession(token);
  return NextResponse.json({ success: true });
}
