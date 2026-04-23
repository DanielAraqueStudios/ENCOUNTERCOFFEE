import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dataDir = path.join(process.cwd(), 'data');
const sessionsFile = path.join(dataDir, 'sessions.json');

interface Session {
  token: string;
  expiresAt: number;
}

function getSessions(): Session[] {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(sessionsFile)) fs.writeFileSync(sessionsFile, '[]');
  try {
    return JSON.parse(fs.readFileSync(sessionsFile, 'utf8'));
  } catch {
    return [];
  }
}

function saveSessions(sessions: Session[]) {
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
}

export function createSession(): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const sessions = getSessions().filter(s => s.expiresAt > Date.now());
  sessions.push({ token, expiresAt });
  saveSessions(sessions);
  return token;
}

export function verifySession(token: string): boolean {
  const sessions = getSessions();
  return sessions.some(s => s.token === token && s.expiresAt > Date.now());
}

export function deleteSession(token: string) {
  saveSessions(getSessions().filter(s => s.token !== token));
}

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get('Authorization');
  return auth?.startsWith('Bearer ') ? auth.slice(7) : null;
}
