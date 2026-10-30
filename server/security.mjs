import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
export const digest = value => createHash('sha256').update(value).digest('hex');
export const secret = () => randomBytes(32).toString('hex');
export function fail(status, message) { const error = new Error(message); error.status = status; throw error; }
export const emailValid = value => typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const passwordValid = value => typeof value === 'string' && value.length >= 15 && value.length <= 128;
export function text(value, min = 0, max = 1000) { return typeof value === 'string' && value.trim().length >= min && value.trim().length <= max; }
export function requireUser(req, _res, next) { if (!req.user) return next(Object.assign(new Error('Inicia sesión para continuar.'), { status: 401 })); next(); }
export function requireAdmin(req, res, next) { requireUser(req, res, error => { if (error) return next(error); if (req.user.role !== 'admin') return next(Object.assign(new Error('Esta sección es exclusiva de administración.'), { status: 403 })); next(); }); }

export function installSecurity(app, store, origin, secure) {
  const { db, demo } = store;
  const cookieName = secure ? '__Host-cf_session' : 'cf_session';
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()' });
    if (secure) res.set('Strict-Transport-Security', 'max-age=31536000');
    next();
  });
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    const raw = req.headers.cookie?.split(';').map(s => s.trim()).find(s => s.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
    let session = raw && db.prepare('SELECT * FROM sessions WHERE token=?').get(digest(raw));
    if (session && (Date.now() - session.touched > 1800000 || Date.now() - session.created > 43200000)) { db.prepare('DELETE FROM sessions WHERE token=?').run(session.token); session = null; }
    req.session = session;
    const user = session?.user_id && db.prepare('SELECT * FROM users WHERE id=?').get(session.user_id);
    req.user = user && (demo || !user.is_demo_user) ? user : null;
    if (session) db.prepare('UPDATE sessions SET touched=? WHERE token=?').run(Date.now(), session.token);
    req.newSession = (userId = null) => {
      if (req.session) db.prepare('DELETE FROM sessions WHERE token=?').run(req.session.token);
      const raw = secret(), now = Date.now();
      const s = { token: digest(raw), user_id: userId, csrf: secret(), created: now, touched: now };
      db.prepare('INSERT INTO sessions VALUES(?,?,?,?,?)').run(s.token, s.user_id, s.csrf, now, now);
      res.cookie(cookieName, raw, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 43200000 });
      req.session = s;
      return s;
    };
    req.logout = () => { if (req.session) db.prepare('DELETE FROM sessions WHERE token=?').run(req.session.token); res.clearCookie(cookieName, { httpOnly: true, secure, sameSite: 'lax', path: '/' }); };
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
      const sent = Buffer.from(req.get('X-CSRF-Token') || ''), expected = Buffer.from(session?.csrf || '');
      if (req.get('origin') !== origin || !session || sent.length !== expected.length || !timingSafeEqual(sent, expected)) return next(Object.assign(new Error('La sesión del formulario terminó. Actualiza e intenta otra vez.'), { status: 403 }));
    }
    next();
  });
}

export function rateLimiter() {
  const counts = new Map();
  return (key, limit = 5, milliseconds = 900000) => {
    const now = Date.now();
    if (counts.size > 1000) for (const [k, v] of counts) if (v.until < now) counts.delete(k);
    let value = counts.get(key);
    if (!value || value.until < now) { value = { count: 0, until: now + milliseconds }; counts.set(key, value); }
    if (++value.count > limit) fail(429, 'Demasiados intentos. Intenta en 15 minutos.');
  };
}
