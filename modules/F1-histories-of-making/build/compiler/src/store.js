// Persistence: the artifact's shared db when the viewer grants it, otherwise this browser's localStorage.
// Docs: decisions/<dimensionId> {chosen, approvals:{optId:{state,note,borrow:[]}}, custom?, updatedAt}
//       session/state {pass, compareA, compareB, updatedAt}; judgments/pairs {pairs, updatedAt}; brief/current {markdown, json, updatedAt}
const LS_KEY = 'edo-composer:v1';
const lsGet = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null') || {}; } catch { return {}; } };
const lsSet = (v) => { try { localStorage.setItem(LS_KEY, JSON.stringify(v)); return true; } catch { return false; } };

export function createStore() {
  let db = null;
  const listeners = [];
  const lastSent = new Map();
  const timers = new Map();
  const api = {
    mode: 'local',
    readLocal: lsGet,
    async connect() {
      try { db = (await window.claude?.use?.('db')) || null; } catch { db = null; }
      api.mode = db ? 'shared' : 'local';
      return api.mode;
    },
    async loadShared() {
      if (!db) return null;
      const out = { decisions: {}, session: null, judgments: null, brief: null };
      try {
        const snap = await db.collection('decisions').get();
        for (const d of snap.docs) if (d.exists) out.decisions[d.id] = d.data();
        const s = await db.doc('session/state').get(); if (s.exists) out.session = s.data();
        const j = await db.doc('judgments/pairs').get(); if (j.exists) out.judgments = j.data();
        const b = await db.doc('brief/current').get(); if (b.exists) out.brief = b.data();
      } catch (e) { console.warn('db load failed', e?.code || e); return null; }
      return out;
    },
    subscribe(cb) {
      listeners.push(cb);
      if (!db) return;
      const echo = (path, data) => lastSent.get(path) === JSON.stringify(strip(data));
      try {
        db.collection('decisions').onSnapshot((snap) => {
          for (const ch of snap.docChanges()) {
            if (ch.type === 'removed') continue;
            const data = ch.doc.data();
            if (ch.doc.metadata.hasPendingWrites || echo('decisions/' + ch.doc.id, data)) continue;
            cb({ kind: 'decision', dim: ch.doc.id, data });
          }
        }, (e) => console.warn('decisions listener ended', e?.code));
        db.doc('session/state').onSnapshot((s) => { if (s.exists && !s.metadata.hasPendingWrites && !echo('session/state', s.data())) cb({ kind: 'session', data: s.data() }); }, () => {});
        db.doc('judgments/pairs').onSnapshot((s) => { if (s.exists && !s.metadata.hasPendingWrites && !echo('judgments/pairs', s.data())) cb({ kind: 'judgments', data: s.data() }); }, () => {});
      } catch (e) { console.warn('subscribe failed', e); }
    },
    // Debounced write of one document; also mirrored to localStorage so a reload without db still restores work.
    write(path, data, delay = 450) {
      const local = lsGet();
      local[path] = data;
      lsSet(local);
      if (!db) return Promise.resolve('local');
      clearTimeout(timers.get(path));
      return new Promise((resolve) => {
        timers.set(path, setTimeout(async () => {
          const body = { ...data, updatedAt: new Date().toISOString() };
          lastSent.set(path, JSON.stringify(strip(body)));
          try { await db.doc(path).set(body); resolve('shared'); } catch (e) {
            if (e?.code === 'unavailable') { setTimeout(() => db.doc(path).set(body).then(() => resolve('shared'), () => resolve('failed')), 800 + Math.random() * 600); }
            else { console.warn('db write failed', path, e?.code); resolve('failed'); }
          }
        }, delay));
      });
    },
    async writeNow(path, data) { return api.write(path, data, 0); },
  };
  return api;
}
function strip(d) { if (!d) return d; const { updatedAt, ...rest } = d; return rest; }
