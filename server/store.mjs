import { DatabaseSync, backup } from 'node:sqlite';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { hash } from '@node-rs/argon2';

export async function createStore(root, dbPath, demo) {
  mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
  const version = db.prepare('PRAGMA user_version').get().user_version;
  if (version < 3 && db.prepare("SELECT name FROM sqlite_master WHERE name='users'").get()) {
    const folder = path.join(root, 'runtime/backups');
    mkdirSync(folder, { recursive: true });
    await backup(db, path.join(folder, `antes-migracion-${Date.now()}.sqlite`));
  }
  db.exec(`
    CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,marketing INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id INTEGER,csrf TEXT NOT NULL,created INTEGER NOT NULL,touched INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY,slug TEXT UNIQUE,document TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS categories(id TEXT PRIMARY KEY,name TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS collections(id TEXT PRIMARY KEY,name TEXT NOT NULL,active INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS materials(id TEXT PRIMARY KEY,name TEXT NOT NULL,karat REAL,fineness INTEGER,verification_status TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS product_stones(id INTEGER PRIMARY KEY,product_id INTEGER NOT NULL REFERENCES products(id),stone_type TEXT NOT NULL,formation_origin TEXT NOT NULL,carat_total REAL,details TEXT);
    CREATE TABLE IF NOT EXISTS certificates(id INTEGER PRIMARY KEY,product_id INTEGER NOT NULL REFERENCES products(id),status TEXT NOT NULL,issuer TEXT,reference TEXT,evidence_reference TEXT);
    CREATE TABLE IF NOT EXISTS product_collections(product_id INTEGER REFERENCES products(id),collection_id TEXT REFERENCES collections(id),PRIMARY KEY(product_id,collection_id));
    CREATE TABLE IF NOT EXISTS variants(sku TEXT PRIMARY KEY,product_id INTEGER NOT NULL REFERENCES products(id),label TEXT NOT NULL,stock_qty INTEGER NOT NULL DEFAULT 0 CHECK(stock_qty>=0));
    CREATE TABLE IF NOT EXISTS prices(id INTEGER PRIMARY KEY,sku TEXT NOT NULL REFERENCES variants(sku),amount_minor INTEGER CHECK(amount_minor>=0),currency TEXT NOT NULL DEFAULT 'MXN',mode TEXT NOT NULL,valid_from INTEGER NOT NULL,valid_to INTEGER,approved_reference TEXT);
    CREATE UNIQUE INDEX IF NOT EXISTS current_price ON prices(sku) WHERE valid_to IS NULL;
    CREATE TABLE IF NOT EXISTS media_assets(id INTEGER PRIMARY KEY,product_id INTEGER REFERENCES products(id),view TEXT NOT NULL,path TEXT NOT NULL,source_kind TEXT NOT NULL,alt TEXT NOT NULL,rights_reference TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS advisories(id TEXT PRIMARY KEY,user_id INTEGER REFERENCES users(id),guest_token_hash TEXT,name TEXT NOT NULL,email TEXT NOT NULL,product_id INTEGER REFERENCES products(id),variant_sku TEXT,subject TEXT NOT NULL,message TEXT NOT NULL,occasion TEXT,budget TEXT,contact_preference TEXT NOT NULL DEFAULT 'portal',status TEXT NOT NULL DEFAULT 'new',priority TEXT NOT NULL DEFAULT 'normal',assigned_to INTEGER REFERENCES users(id),created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,first_response_at INTEGER,closed_at INTEGER,idempotency_key TEXT UNIQUE NOT NULL,payload_hash TEXT NOT NULL,source TEXT NOT NULL DEFAULT 'web',is_demo INTEGER NOT NULL DEFAULT 0);
    CREATE INDEX IF NOT EXISTS advisory_user ON advisories(user_id,updated_at);
    CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY,advisory_id TEXT NOT NULL REFERENCES advisories(id),user_id INTEGER REFERENCES users(id),author_name TEXT NOT NULL,body TEXT NOT NULL,internal INTEGER NOT NULL DEFAULT 0,created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS quotes(id TEXT PRIMARY KEY,advisory_id TEXT NOT NULL REFERENCES advisories(id),title TEXT NOT NULL,amount_minor INTEGER NOT NULL CHECK(amount_minor>0),currency TEXT NOT NULL DEFAULT 'MXN',details TEXT NOT NULL,valid_until INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'sent',created_by INTEGER REFERENCES users(id),created_at INTEGER NOT NULL,responded_at INTEGER,is_demo INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS appointments(id TEXT PRIMARY KEY,advisory_id TEXT NOT NULL REFERENCES advisories(id),starts_at INTEGER NOT NULL,channel TEXT NOT NULL,note TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'proposed',created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS favorites(user_id INTEGER REFERENCES users(id),sku TEXT NOT NULL REFERENCES variants(sku),created_at INTEGER NOT NULL,PRIMARY KEY(user_id,sku));
    CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS policy_versions(id INTEGER PRIMARY KEY,type TEXT NOT NULL,body TEXT NOT NULL,status TEXT NOT NULL,created_at INTEGER NOT NULL,created_by INTEGER REFERENCES users(id));
    CREATE TABLE IF NOT EXISTS consents(id INTEGER PRIMARY KEY,user_id INTEGER REFERENCES users(id),purpose TEXT NOT NULL,granted INTEGER NOT NULL,created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS audit_events(id INTEGER PRIMARY KEY,actor_id INTEGER,action TEXT NOT NULL,entity_type TEXT NOT NULL,entity_id TEXT NOT NULL,detail TEXT NOT NULL,created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS auth_tokens(token_hash TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),kind TEXT NOT NULL,expires_at INTEGER NOT NULL,used_at INTEGER);
    CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY,user_id INTEGER REFERENCES users(id),recipient TEXT NOT NULL,subject TEXT NOT NULL,body TEXT NOT NULL,status TEXT NOT NULL,created_at INTEGER NOT NULL,error TEXT);
    CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,type TEXT NOT NULL,product_id INTEGER REFERENCES products(id),created_at INTEGER NOT NULL);
  `);
  const addColumn = (table, name, ddl) => {
    if (!db.prepare(`PRAGMA table_info(${table})`).all().some(c => c.name === name)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${ddl}`);
  };
  addColumn('users', 'role', "TEXT NOT NULL DEFAULT 'client'");
  addColumn('users', 'verified_at', 'INTEGER');
  addColumn('users', 'is_demo_user', 'INTEGER NOT NULL DEFAULT 0');
  addColumn('users', 'created_at', 'INTEGER NOT NULL DEFAULT 0');
  addColumn('products', 'demo_fixture', 'INTEGER NOT NULL DEFAULT 0');
  addColumn('products', 'material_id', 'TEXT REFERENCES materials(id)');
  const read = name => JSON.parse(readFileSync(path.join(root, 'data', name), 'utf8'));
  for (const c of read('categorias.json')) db.prepare('INSERT OR IGNORE INTO categories VALUES(?,?)').run(c.id, c.name);
  for (const c of read('colecciones.json')) db.prepare('INSERT OR IGNORE INTO collections VALUES(?,?,?)').run(c.id, c.name, c.id === 'con-significado' ? 0 : 1);
  const transaction = fn => { db.exec('BEGIN IMMEDIATE'); try { const value = fn(); db.exec('COMMIT'); return value; } catch (e) { db.exec('ROLLBACK'); throw e; } };
  const document = row => row && JSON.parse(row.document);
  const findProduct = id => document(db.prepare('SELECT document FROM products WHERE id=?').get(id));
  const audit = (actor, action, entity, id, detail = '') => db.prepare('INSERT INTO audit_events(actor_id,action,entity_type,entity_id,detail,created_at) VALUES(?,?,?,?,?,?)').run(actor || null, action, entity, String(id), detail, Date.now());
  const syncProduct = p => {
    const materialId=p.material.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+(p.metal_karat||p.metal_fineness||'pendiente');
    db.prepare('INSERT INTO materials VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,karat=excluded.karat,fineness=excluded.fineness').run(materialId,p.material,p.metal_karat||null,p.metal_fineness||null,'pending');
    db.prepare('UPDATE products SET material_id=? WHERE id=?').run(materialId,p.id);
    db.prepare('DELETE FROM product_stones WHERE product_id=?').run(p.id);
    if(p.stone_origin!=='none')for(const g of p.stone_groups||[{stone_type:p.stone_type,formation_origin:p.stone_origin,carat_total:p.stone_carat_total,details:p.stone_details}])db.prepare('INSERT INTO product_stones(product_id,stone_type,formation_origin,carat_total,details) VALUES(?,?,?,?,?)').run(p.id,g.stone_type||'Por verificar',g.formation_origin||'unknown',g.carat_total??null,g.details||null);
    db.prepare('DELETE FROM certificates WHERE product_id=?').run(p.id);
    db.prepare('INSERT INTO certificates(product_id,status,issuer,reference,evidence_reference) VALUES(?,?,?,?,?)').run(p.id,p.certificate_status||(p.stone_origin==='none'?'not_applicable':'pending_verification'),p.certificate_issuer||null,p.certificate_reference||null,p.certificate_evidence||null);
    db.prepare('DELETE FROM product_collections WHERE product_id=?').run(p.id);
    for (const id of p.collections || []) db.prepare('INSERT INTO product_collections VALUES(?,?)').run(p.id, id);
    const old = db.prepare('SELECT sku FROM variants WHERE product_id=?').all().map(v => v.sku);
    for (const v of p.variants) {
      db.prepare('INSERT INTO variants VALUES(?,?,?,?) ON CONFLICT(sku) DO UPDATE SET label=excluded.label,stock_qty=excluded.stock_qty').run(v.sku, p.id, v.label, v.stock_qty || 0);
      const amount = p.price_mode === 'quote' ? null : Math.round(p.price_mxn * 100);
      const current = db.prepare('SELECT * FROM prices WHERE sku=? AND valid_to IS NULL').get(v.sku);
      const mode = p.price_mode || 'demo';
      if (!current || current.amount_minor !== amount || current.mode !== mode || current.approved_reference !== (p.price_approval || null)) {
        db.prepare('UPDATE prices SET valid_to=? WHERE sku=? AND valid_to IS NULL').run(Date.now(), v.sku);
        db.prepare('INSERT INTO prices(sku,amount_minor,mode,valid_from,approved_reference) VALUES(?,?,?,?,?)').run(v.sku, amount, mode, Date.now(), p.price_approval || null);
      }
    }
    // Las variantes históricas no se borran: quedan sin existencias y fuera de la ficha.
    for (const sku of old.filter(sku => !p.variants.some(v => v.sku === sku))) db.prepare('UPDATE variants SET stock_qty=0 WHERE sku=?').run(sku);
    db.prepare('DELETE FROM media_assets WHERE product_id=?').run(p.id);
    const media = p.media || ['front', 'side', 'detail'].map((view, i) => ({ view, path: `/assets/products/${p.slug}.png`, source_kind: 'ai_generated', alt: `${p.name}, ${view}; imagen generada con IA`, rights_reference: 'IMAGENES.md', panel: i }));
    for (const m of media) db.prepare('INSERT INTO media_assets(product_id,view,path,source_kind,alt,rights_reference) VALUES(?,?,?,?,?,?)').run(p.id, m.view, m.path, m.source_kind, m.alt, m.rights_reference);
  };
  transaction(() => {
    for (const p of read('productos_demo.json')) {
      const row = db.prepare('SELECT * FROM products WHERE id=?').get(p.id);
      if (!row) db.prepare('INSERT INTO products(id,slug,document,demo_fixture) VALUES(?,?,?,1)').run(p.id, p.slug, JSON.stringify({ ...p, price_mode: 'demo', verification_status: 'pending' }));
      if (row && version < 2) db.prepare('UPDATE products SET demo_fixture=1 WHERE id=?').run(p.id);
    }
    for (const row of db.prepare('SELECT * FROM products').all()) if (version < 3 || !db.prepare('SELECT sku FROM variants WHERE product_id=?').get(row.id)) syncProduct(document(row));
    const defaults = { service_name: 'Atelier C’FANCY', service_hours: 'Lunes a viernes · 10:00 a 18:00, Ciudad de México', response_note: 'Tu consulta se atiende desde nuestro espacio de asesoría.', contact_email: '', contact_phone: '', coverage: 'Cobertura por confirmar con asesoría', privacy: 'Demostración local. Tus datos se guardan en este servidor para gestionar la consulta. No se envían a terceros. Utiliza datos de prueba.', privacy_status: 'draft', shipping: 'Condiciones de envío pendientes de aprobación.', shipping_status: 'draft', warranty: 'Condiciones de garantía pendientes de aprobación.', warranty_status: 'draft', returns: 'Condiciones de cambios y devoluciones pendientes de aprobación.', returns_status: 'draft' };
    for (const [key, value] of Object.entries(defaults)) db.prepare('INSERT OR IGNORE INTO settings VALUES(?,?)').run(key, value);
    db.exec('PRAGMA user_version=3');
  });
  if (demo && process.env.SEED_DEMO_USERS !== 'false') {
    for (const u of [{ name: 'Administración C’FANCY', email: 'admin@cfancy.demo', password: 'Cfancy.Admin.2026!', role: 'admin' }, { name: 'Valentina', email: 'cliente@cfancy.demo', password: 'Cfancy.Cliente.2026!', role: 'client' }]) {
      if (!db.prepare('SELECT id FROM users WHERE email=?').get(u.email)) db.prepare('INSERT INTO users(name,email,password,role,verified_at,is_demo_user,created_at) VALUES(?,?,?,?,?,1,?)').run(u.name, u.email, await hash(u.password, { memoryCost: 19456, timeCost: 2, parallelism: 1 }), u.role, Date.now(), Date.now());
    }
  }
  return { db, transaction, audit, findProduct, syncProduct, read, demo, root, dbPath };
}

export function settingsOf(db) { return Object.fromEntries(db.prepare('SELECT * FROM settings').all().map(r => [r.key, r.value])); }
export function publicUser(u) { return u && { id: u.id, name: u.name, email: u.email, role: u.role, verified: !!u.verified_at, marketing: !!u.marketing, is_demo: !!u.is_demo_user }; }
export const uuid = () => randomUUID();
