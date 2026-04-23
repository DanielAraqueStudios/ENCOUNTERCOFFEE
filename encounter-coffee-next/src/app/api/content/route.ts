import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/data';
import { verifySession, getTokenFromRequest } from '@/lib/auth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  return NextResponse.json(getContent(), { headers: CORS });
}

export async function PUT(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401, headers: CORS });
  }
  const content = await req.json();
  saveContent(content);
  return NextResponse.json({ success: true }, { headers: CORS });
}
