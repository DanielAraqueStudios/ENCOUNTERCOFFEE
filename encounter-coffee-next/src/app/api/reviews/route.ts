import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const reviewsFile = path.join(dataDir, 'reviews.json');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getReviews(): Review[] {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(reviewsFile)) fs.writeFileSync(reviewsFile, '[]');
  try {
    return JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
  } catch {
    return [];
  }
}

function saveReviews(reviews: Review[]): boolean {
  try {
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
    return true;
  } catch {
    return false;
  }
}

interface Review {
  id: string;
  name: string;
  review: string;
  rating: number;
  date: string;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const perPage = parseInt(searchParams.get('perPage') ?? '3');

  const reviews = getReviews();
  reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = reviews.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const validPage = Math.min(page, totalPages);
  const paginated = reviews.slice((validPage - 1) * perPage, validPage * perPage);

  return NextResponse.json(
    { success: true, reviews: paginated, currentPage: validPage, totalPages, totalReviews: total, perPage },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400, headers: CORS_HEADERS });
  }

  const { name, review, rating } = body;

  if (!name || !review || !rating) {
    return NextResponse.json(
      { success: false, message: 'Missing required fields: name, review, rating' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const ratingNum = parseInt(rating);
  if (ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json(
      { success: false, message: 'Rating must be between 1 and 5' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const newReview: Review = {
    id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: String(name).substring(0, 100),
    review: String(review).substring(0, 1000),
    rating: ratingNum,
    date: new Date().toISOString(),
  };

  const reviews = getReviews();
  reviews.push(newReview);

  if (!saveReviews(reviews)) {
    return NextResponse.json({ success: false, message: 'Failed to save review' }, { status: 500, headers: CORS_HEADERS });
  }

  return NextResponse.json(
    { success: true, message: 'Review submitted successfully', review: newReview },
    { status: 201, headers: CORS_HEADERS }
  );
}
