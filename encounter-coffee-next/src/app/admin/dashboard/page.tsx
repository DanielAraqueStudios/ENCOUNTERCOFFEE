'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const API = 'http://localhost:3001/api';

type Tab = 'images' | 'videos' | 'texts';

interface VideoEntry { filename: string; order: number; }

const IMAGES = [
  { key: 'frase3',        label: 'Hero Scene 2 Background',  path: 'images/Home/Fotos_a_usar/Frase 3.jpg' },
  { key: 'hero-bg',       label: 'Hero Background (hero-bg)', path: 'images/hero-bg.jpg' },
  { key: 'product-pods',  label: 'Product: Pods (10_pods)',   path: 'images/products/10_pods.jpg' },
  { key: 'product-drips', label: 'Product: Drips',            path: 'images/products/drips.jpg' },
  { key: 'product-grano', label: 'Product: Whole Bean',       path: 'images/products/grano_entero.jpg' },
];

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken]   = useState('');
  const [tab, setTab]       = useState<Tab>('images');
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [msg, setMsg]       = useState('');
  const [msgType, setMsgType] = useState<'ok' | 'err'>('ok');
  // imgStamps forces the <img> to reload after upload by busting cache
  const [imgStamps, setImgStamps] = useState<Record<string, number>>({});
  const [imgStatus, setImgStatus] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const flash = (text: string, type: 'ok' | 'err' = 'ok') => {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(''), 4000);
  };

  const authHeaders = useCallback((extra?: Record<string, string>) => ({
    Authorization: `Bearer ${token}`,
    ...extra,
  }), [token]);

  useEffect(() => {
    const t = localStorage.getItem('admin_token') ?? '';
    if (!t) { router.push('/admin'); return; }
    fetch(`${API}/auth/verify`, { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json())
      .then(d => {
        if (!d.valid) { router.push('/admin'); return; }
        setToken(t);
        fetch(`${API}/content`).then(r => r.json()).then(setContent).catch(() => {});
        fetch(`${API}/videos`).then(r => r.json()).then(setVideos).catch(() => {});
      })
      .catch(() => router.push('/admin'));
  }, [router]);

  async function logout() {
    await fetch(`${API}/auth/logout`, { method: 'POST', headers: authHeaders() }).catch(() => {});
    localStorage.removeItem('admin_token');
    router.push('/admin');
  }

  // ── IMAGES ──
  async function uploadImage(key: string, file: File) {
    setImgStatus(s => ({ ...s, [key]: 'Uploading…' }));
    const fd = new FormData();
    fd.append('key', key);
    fd.append('file', file);
    try {
      const res = await fetch(`${API}/upload/image`, { method: 'POST', headers: authHeaders(), body: fd });
      const data = await res.json();
      if (data.success) {
        setImgStatus(s => ({ ...s, [key]: '✓ Updated' }));
        setImgStamps(s => ({ ...s, [key]: Date.now() }));
        flash('Image updated successfully');
      } else {
        setImgStatus(s => ({ ...s, [key]: '✗ Failed' }));
        flash(data.message, 'err');
      }
    } catch {
      setImgStatus(s => ({ ...s, [key]: '✗ Error' }));
      flash('Upload failed', 'err');
    }
  }

  // ── VIDEOS ──
  async function uploadVideo(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(`${API}/videos`, { method: 'POST', headers: authHeaders(), body: fd });
      const data = await res.json();
      if (data.success) {
        const updated = await fetch(`${API}/videos`).then(r => r.json());
        setVideos(updated);
        flash('Video uploaded');
      } else {
        flash(data.message, 'err');
      }
    } catch {
      flash('Upload failed', 'err');
    }
  }

  async function moveVideo(index: number, dir: -1 | 1) {
    const next = [...videos];
    const swap = index + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    const reordered = next.map((v, i) => ({ ...v, order: i + 1 }));
    setVideos(reordered);
    await fetch(`${API}/videos`, {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ videos: reordered }),
    });
    flash('Order saved');
  }

  async function deleteVideo(filename: string) {
    if (!confirm(`Delete "${filename}"?`)) return;
    await fetch(`${API}/videos`, {
      method: 'DELETE',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ filename }),
    });
    setVideos(v => v.filter(x => x.filename !== filename));
    flash('Video deleted');
  }

  // ── TEXTS ──
  function updateField(section: string, field: string, value: string) {
    setContent(c => ({ ...c, [section]: { ...c[section], [field]: value } }));
  }

  async function saveTexts() {
    setSaving(true);
    try {
      const res = await fetch(`${API}/content`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(content),
      });
      const data = await res.json();
      flash(data.success ? 'Content saved' : data.message, data.success ? 'ok' : 'err');
    } catch {
      flash('Save failed', 'err');
    } finally {
      setSaving(false);
    }
  }

  const wwd = content.whatWeDo ?? {};
  const indexHero = content.indexHero ?? {};
  const heroMode = (indexHero.mode as string) || 'image';

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', fontFamily: 'system-ui, sans-serif', color: '#1a1a1a' }}>

      {/* Header */}
      <header style={{ background: '#2F4466', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#ffffff' }}>Encounter Coffee</span>
          <span style={{ color: '#DDC165', marginLeft: '0.75rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin</span>
        </div>
        <button onClick={logout} style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          Log out
        </button>
      </header>

      {/* Flash message */}
      {msg && (
        <div style={{ background: msgType === 'ok' ? '#d4edda' : '#f8d7da', color: msgType === 'ok' ? '#155724' : '#721c24', padding: '0.75rem 2rem', fontSize: '0.9rem', fontWeight: 500 }}>
          {msg}
        </div>
      )}

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '2rem', background: '#ffffff', borderRadius: 10, padding: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {(['images', 'videos', 'texts'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '0.65rem', border: 'none', borderRadius: 8, cursor: 'pointer',
              fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize',
              background: tab === t ? '#7C090F' : 'transparent',
              color: tab === t ? '#ffffff' : '#2F4466',
              transition: 'all 0.15s',
            }}>{t}</button>
          ))}
        </div>

        {/* ── IMAGES TAB ── */}
        {tab === 'images' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Homepage hero title: image vs text toggle */}
            <div style={card}>
              <p style={{ margin: '0 0 0.75rem', fontWeight: 700, color: '#1a1a1a' }}>Homepage Hero Title</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
                <button
                  onClick={() => updateField('indexHero', 'mode', 'image')}
                  style={{ ...smallBtn, background: heroMode === 'image' ? '#2F4466' : '#ffffff', color: heroMode === 'image' ? '#ffffff' : '#1a1a1a', fontWeight: 600, padding: '0.4rem 1rem' }}
                >Image</button>
                <button
                  onClick={() => updateField('indexHero', 'mode', 'text')}
                  style={{ ...smallBtn, background: heroMode === 'text' ? '#2F4466' : '#ffffff', color: heroMode === 'text' ? '#ffffff' : '#1a1a1a', fontWeight: 600, padding: '0.4rem 1rem' }}
                >Text</button>
              </div>

              {heroMode === 'image' ? (
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <img
                    key={imgStamps['hero-title-img'] ?? 0}
                    src={`${API}/image?key=hero-title-img&t=${imgStamps['hero-title-img'] ?? 0}`}
                    alt="Hero Title Image"
                    style={{ width: 200, height: 80, objectFit: 'contain', borderRadius: 6, border: '1px solid #ddd', flexShrink: 0, background: '#333' }}
                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#666', fontFamily: 'monospace' }}>images/Home/Logos/Frase home.png</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage('hero-title-img', f); e.target.value = ''; }}
                      style={{ fontSize: '0.875rem', color: '#1a1a1a' }}
                    />
                    {imgStatus['hero-title-img'] && (
                      <span style={{ display: 'block', marginTop: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: imgStatus['hero-title-img'].startsWith('✓') ? '#155724' : imgStatus['hero-title-img'].startsWith('✗') ? '#721c24' : '#444' }}>
                        {imgStatus['hero-title-img']}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>Text to display</label>
                  <textarea
                    value={indexHero.text ?? ''}
                    onChange={e => updateField('indexHero', 'text', e.target.value)}
                    rows={3}
                    placeholder="Enter the hero title text…"
                    style={{ width: '100%', padding: '0.6rem', border: '1.5px solid #ddd', borderRadius: 6, fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6, color: '#1a1a1a', background: '#ffffff' }}
                  />
                </div>
              )}

              <button onClick={saveTexts} disabled={saving} style={{ ...btnPrimary, marginTop: '1rem', padding: '0.5rem 1.2rem', fontSize: '0.875rem', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>

            {IMAGES.map(img => (
              <div key={img.key} style={card}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <img
                    key={imgStamps[img.key] ?? 0}
                    src={`${API}/image?key=${img.key}&t=${imgStamps[img.key] ?? 0}`}
                    alt={img.label}
                    style={{ width: 140, height: 90, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd', flexShrink: 0, background: '#eee' }}
                    onError={e => { (e.target as HTMLImageElement).alt = 'No image'; }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.3rem', fontWeight: 700, color: '#1a1a1a', fontSize: '0.95rem' }}>{img.label}</p>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#666', fontFamily: 'monospace' }}>{img.path}</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(img.key, f); e.target.value = ''; }}
                      style={{ fontSize: '0.875rem', color: '#1a1a1a' }}
                    />
                  </div>
                  {imgStatus[img.key] && (
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: imgStatus[img.key].startsWith('✓') ? '#155724' : imgStatus[img.key].startsWith('✗') ? '#721c24' : '#444' }}>
                      {imgStatus[img.key]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── VIDEOS TAB ── */}
        {tab === 'videos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={card}>
              <p style={{ margin: '0 0 0.75rem', fontWeight: 700, color: '#1a1a1a' }}>Upload New Video</p>
              <input
                type="file"
                accept="video/mp4,video/*"
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadVideo(f); e.target.value = ''; }}
                style={{ fontSize: '0.875rem', color: '#1a1a1a' }}
              />
            </div>

            <div style={card}>
              <p style={{ margin: '0 0 1rem', fontWeight: 700, color: '#1a1a1a' }}>Current Videos</p>
              {videos.length === 0 && <p style={{ color: '#666', fontSize: '0.875rem' }}>No videos yet.</p>}
              {videos.map((v, i) => (
                <div key={v.filename} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < videos.length - 1 ? '1px solid #eee' : 'none' }}>
                  <span style={{ color: '#888', fontSize: '0.8rem', width: 24, fontWeight: 600 }}>#{i + 1}</span>
                  <span style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', color: '#1a1a1a' }}>{v.filename}</span>
                  <button onClick={() => moveVideo(i, -1)} disabled={i === 0} style={smallBtn}>↑</button>
                  <button onClick={() => moveVideo(i, 1)} disabled={i === videos.length - 1} style={smallBtn}>↓</button>
                  <button onClick={() => deleteVideo(v.filename)} style={{ ...smallBtn, background: '#7C090F', color: '#ffffff', borderColor: '#7C090F' }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TEXTS TAB ── */}
        {tab === 'texts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { field: 'heroTitle',             label: 'Hero Title ("We exist to transform…")' },
              { field: 'qualityHumanityHeading', label: 'Quality/Humanity Section Heading' },
              { field: 'qualityLabel',           label: 'Quality Label' },
              { field: 'humanityLabel',          label: 'Humanity Label' },
              { field: 'victorBio',              label: "Victor's Bio" },
              { field: 'johnBlancaBio',          label: "John & Blanca's Story" },
              { field: 'camilaBio',              label: "Camila's Bio" },
              { field: 'nicoBio',                label: "Nico's Bio" },
            ].map(({ field, label }) => (
              <div key={field} style={card}>
                <label style={{ display: 'block', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{label}</label>
                <textarea
                  value={wwd[field] ?? ''}
                  onChange={e => updateField('whatWeDo', field, e.target.value)}
                  rows={['victorBio','johnBlancaBio','camilaBio','nicoBio'].includes(field) ? 6 : 2}
                  style={{ width: '100%', padding: '0.6rem', border: '1.5px solid #ddd', borderRadius: 6, fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6, color: '#1a1a1a', background: '#ffffff' }}
                />
              </div>
            ))}
            <button onClick={saveTexts} disabled={saving} style={{ ...btnPrimary, maxWidth: 200, alignSelf: 'flex-end', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Save All Texts'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const card: React.CSSProperties      = { background: '#ffffff', borderRadius: 10, padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', color: '#1a1a1a' };
const smallBtn: React.CSSProperties  = { padding: '0.25rem 0.6rem', border: '1px solid #ccc', borderRadius: 4, background: '#ffffff', color: '#1a1a1a', cursor: 'pointer', fontSize: '0.8rem' };
const btnPrimary: React.CSSProperties = { padding: '0.7rem 1.5rem', background: '#7C090F', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' };
