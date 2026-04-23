import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { username, password } = body;

  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'encounter2025';

  if (username !== validUsername || password !== validPassword) {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401, headers: CORS });
  }

  const token = createSession();
  return NextResponse.json({ success: true, token }, { headers: CORS });
}
