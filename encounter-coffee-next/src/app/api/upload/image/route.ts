import { NextRequest, NextResponse } from 'next/server';
import { verifySession, getTokenFromRequest } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization',
};

// Maps admin key → absolute path of the image file to replace
const IMAGE_PATHS: Record<string, string> = {
  'hero-bg':         path.join(process.cwd(), '..', 'images', 'hero-bg.jpg'),
  'hero-title-img':  path.join(process.cwd(), '..', 'images', 'Home', 'Logos', 'Frase home.png'),
  'frase3':          path.join(process.cwd(), '..', 'images', 'Home', 'Fotos_a_usar', 'Frase 3.jpg'),
  'product-pods':    path.join(process.cwd(), '..', 'images', 'products', '10_pods.jpg'),
  'product-drips':   path.join(process.cwd(), '..', 'images', 'products', 'drips.jpg'),
  'product-grano':   path.join(process.cwd(), '..', 'images', 'products', 'grano_entero.jpg'),
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  const formData = await req.formData();
  const key = formData.get('key') as string;
  const file = formData.get('file') as File;

  if (!key || !file) {
    return NextResponse.json({ success: false, message: 'Missing key or file' }, { status: 400, headers: CORS });
  }

  const targetPath = IMAGE_PATHS[key];
  if (!targetPath) {
    return NextResponse.json({ success: false, message: 'Unknown image key' }, { status: 400, headers: CORS });
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const bytes = await file.arrayBuffer();
  fs.writeFileSync(targetPath, Buffer.from(bytes));

  return NextResponse.json({ success: true, message: 'Image updated' }, { headers: CORS });
}
