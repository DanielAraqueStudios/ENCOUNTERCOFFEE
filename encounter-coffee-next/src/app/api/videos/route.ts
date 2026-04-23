import { NextRequest, NextResponse } from 'next/server';
import { getVideos, saveVideos, VideoEntry } from '@/lib/data';
import { verifySession, getTokenFromRequest } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const VIDEOS_DIR = path.join(process.cwd(), '..', 'images', 'Home', 'Fotos_a_usar');

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  return NextResponse.json(getVideos(), { headers: CORS });
}

// Upload new video
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400, headers: CORS });
  }

  const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  fs.writeFileSync(path.join(VIDEOS_DIR, filename), Buffer.from(await file.arrayBuffer()));

  const videos = getVideos();
  const maxOrder = videos.reduce((m, v) => Math.max(m, v.order), 0);
  videos.push({ filename, order: maxOrder + 1 });
  saveVideos(videos);

  return NextResponse.json({ success: true, filename }, { status: 201, headers: CORS });
}

// Reorder videos — body: { videos: VideoEntry[] }
export async function PUT(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  const { videos }: { videos: VideoEntry[] } = await req.json();
  saveVideos(videos);
  return NextResponse.json({ success: true }, { headers: CORS });
}

// Delete video — body: { filename: string }
export async function DELETE(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  const { filename }: { filename: string } = await req.json();
  const filePath = path.join(VIDEOS_DIR, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  const videos = getVideos()
    .filter(v => v.filename !== filename)
    .map((v, i) => ({ ...v, order: i + 1 }));
  saveVideos(videos);

  return NextResponse.json({ success: true }, { headers: CORS });
}
