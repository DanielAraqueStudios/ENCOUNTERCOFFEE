import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const IMAGE_PATHS: Record<string, string> = {
  'hero-bg':         path.join(process.cwd(), '..', 'images', 'hero-bg.jpg'),
  'hero-title-img':  path.join(process.cwd(), '..', 'images', 'Home', 'Logos', 'Frase home.png'),
  'frase3':          path.join(process.cwd(), '..', 'images', 'Home', 'Fotos_a_usar', 'Frase 3.jpg'),
  'product-pods':    path.join(process.cwd(), '..', 'images', 'products', '10_pods.jpg'),
  'product-drips':   path.join(process.cwd(), '..', 'images', 'products', 'drips.jpg'),
  'product-grano':   path.join(process.cwd(), '..', 'images', 'products', 'grano_entero.jpg'),
};

const MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  gif: 'image/gif', webp: 'image/webp',
};

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key') ?? '';
  const filePath = IMAGE_PATHS[key];

  if (!filePath || !fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const ext = path.extname(filePath).slice(1).toLowerCase();
  const buffer = fs.readFileSync(filePath);

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': MIME[ext] ?? 'image/jpeg',
      'Cache-Control': 'no-store',
    },
  });
}
