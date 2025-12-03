import { Router } from 'express';
import fs from 'fs/promises';

const router = Router();

let cache = { items: [], loadedAt: 0 };
const FILE_URL = new URL('../data/resources.json', import.meta.url);
const TTL_MS = 5 * 60 * 1000;

async function loadResources() {
  const txt = await fs.readFile(FILE_URL, 'utf-8');
  const items = JSON.parse(txt);
  // pinned first, then title asc
  items.sort((a, b) => (b.pinned === true) - (a.pinned === true) || a.title.localeCompare(b.title));
  cache = { items, loadedAt: Date.now() };
}

router.get('/', async (req, res) => {
  if (!cache.items.length || Date.now() - cache.loadedAt > TTL_MS) {
    try { await loadResources(); } catch { return res.json([]); }
  }

  const q = String(req.query.q || '').trim().toLowerCase();
  const cat = String(req.query.category || '').trim().toLowerCase();
  const tag = String(req.query.tag || '').trim().toLowerCase();
  const lang = String(req.query.language || '').trim().toLowerCase();
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 50));

  let items = cache.items;
  if (q) items = items.filter((r) =>
    r.title.toLowerCase().includes(q) || (r.summary || '').toLowerCase().includes(q) || (r.source || '').toLowerCase().includes(q)
  );
  if (cat) items = items.filter((r) => (r.category || '').toLowerCase() === cat);
  if (tag) items = items.filter((r) => (r.tags || []).map((t) => t.toLowerCase()).includes(tag));
  if (lang) items = items.filter((r) => (r.language || '').toLowerCase() === lang);

  res.json(items.slice(0, limit));
});

export default router;
