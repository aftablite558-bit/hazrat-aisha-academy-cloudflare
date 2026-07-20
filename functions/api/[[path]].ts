import { Hono } from 'hono';
import bcrypt from 'bcryptjs';

const app = new Hono<{ Bindings: { 
  DB: D1Database, 
  OWNER_NAME: string, 
  OWNER_EMAIL: string, 
  OWNER_USERNAME: string, 
  OWNER_PASSWORD: string 
} }>().basePath('/api');

let setupChecked = false;

async function ensureTableAndColumns(DB: any, tableName: string, keys: string[]) {
  const stmt = DB.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`);
  const tableExists = await stmt.bind(tableName).first();
  
  if (!tableExists) {
    await DB.prepare(`CREATE TABLE IF NOT EXISTS ${tableName} (id TEXT PRIMARY KEY)`).run();
  }
  
  if (keys.length > 0) {
    const { results: columns } = await DB.prepare(`PRAGMA table_info(${tableName})`).all();
    const existingColumns = columns.map((col: any) => col.name);
    
    for (const key of keys) {
      if (key !== 'id' && !existingColumns.includes(key)) {
        try {
          await DB.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${key} TEXT`).run();
        } catch (e) {
          console.error(`Failed to add column ${key} to ${tableName}`, e);
        }
      }
    }
  }
}

async function seedOwner(c: any) {
  try {
    console.log('Checking for existing owner...');
    let userCount = 0;
    try {
      const stmt = c.env.DB.prepare('SELECT COUNT(*) as user_count FROM users');
      const result = await stmt.first<any>();
      userCount = result ? (result.user_count || result['COUNT(*)'] || 0) : 0;
    } catch (e: any) {
      if (e.message && e.message.includes('no such table')) {
        console.log('Tables do not exist. Creating schema...');
        await ensureTableAndColumns(c.env.DB, 'users', ['username', 'email', 'password_hash', 'role']);
        userCount = 0;
      } else {
        throw e;
      }
    }
    
    if (userCount === 0) {
      const { OWNER_EMAIL, OWNER_USERNAME, OWNER_PASSWORD } = c.env;
      
      if (OWNER_EMAIL && OWNER_USERNAME && OWNER_PASSWORD) {
        const password_hash = await bcrypt.hash(OWNER_PASSWORD, 10);
        await c.env.DB.prepare('INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)')
          .bind(crypto.randomUUID(), OWNER_USERNAME, OWNER_EMAIL, password_hash, 'owner')
          .run();
        console.log('Owner account seeded successfully.');
      }
    }
  } catch (e) {
    console.error('Error seeding owner:', e);
  }
}

app.use(async (c, next) => {
  if (!setupChecked) {
    await seedOwner(c);
    setupChecked = true;
  }
  await next();
});

const ALLOWED_COLLECTIONS = [
  'users', 'students', 'staff', 'teachers', 'classes', 'subjects', 'attendance', 
  'homework', 'results', 'reportcards', 'admissions', 'fees', 'notices', 
  'gallery', 'documents', 'calendar', 'achievements', 'testimonials', 
  'audit_logs', 'settings', 'school_info', 'notifications', 'exam_marks', 'alumni', 'sections'
];

// Generic CRUD (stripped /api prefix)
app.get('/collection/:name', async (c) => {
  const name = c.req.param('name');
  if (!ALLOWED_COLLECTIONS.includes(name)) return c.json({ error: 'Unauthorized' }, 403);
  
  const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 50;
  const offset = c.req.query('offset') ? parseInt(c.req.query('offset')!) : 0;
  const search = c.req.query('search');
  
  let query = `SELECT * FROM ${name}`;
  const params: any[] = [];
  
  // ensure table exists so SELECT doesn't crash
  await ensureTableAndColumns(c.env.DB, name, []);

  if (search) {
    const searchableTables = ['students', 'staff', 'users'];
    if (searchableTables.includes(name)) {
      query += ` WHERE fullName LIKE ? OR email LIKE ?`;
      params.push(`%${search}%`, `%${search}%`);
    }
  }
  
  query += ` LIMIT ${limit} OFFSET ${offset}`;
  
  const { results } = await c.env.DB.prepare(query)
    .bind(...params)
    .all();
    
  return c.json(results);
});

app.post('/collection/:name', async (c) => {
  const name = c.req.param('name');
  if (!ALLOWED_COLLECTIONS.includes(name)) return c.json({ error: 'Unauthorized' }, 403);
  
  const body = await c.req.json();
  
  if (name === 'users' && body.password) {
    body.password_hash = await bcrypt.hash(body.password, 10);
    delete body.password;
  }

  const keys = Object.keys(body);
  const values = Object.values(body);
  
  await ensureTableAndColumns(c.env.DB, name, keys);
  
  const result = await c.env.DB.prepare(`INSERT INTO ${name} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`)
    .bind(...values)
    .run();
    
  return c.json({ success: true, id: body.id || result.meta.last_row_id });
});

app.post('/collection/:name/:id/update', async (c) => {
  const name = c.req.param('name');
  const id = c.req.param('id');
  if (!ALLOWED_COLLECTIONS.includes(name)) return c.json({ error: 'Unauthorized' }, 403);
  
  const body = await c.req.json();
  
  if (name === 'users' && body.password) {
    body.password_hash = await bcrypt.hash(body.password, 10);
    delete body.password;
  }

  const setClause = Object.keys(body).map(key => `${key} = ?`).join(', ');
  
  await ensureTableAndColumns(c.env.DB, name, Object.keys(body));

  await c.env.DB.prepare(`UPDATE ${name} SET ${setClause} WHERE id = ?`)
    .bind(...Object.values(body), id)
    .run();
    
  return c.json({ success: true });
});

app.post('/collection/:name/:id/delete', async (c) => {
  const name = c.req.param('name');
  const id = c.req.param('id');
  if (!ALLOWED_COLLECTIONS.includes(name)) return c.json({ error: 'Unauthorized' }, 403);
  
  await c.env.DB.prepare(`DELETE FROM ${name} WHERE id = ?`)
    .bind(id)
    .run();
    
  return c.json({ success: true });
});

// Auth (stripped /api prefix)
app.get('/auth/check-setup', async (c) => {
  try {
    const stmt = c.env.DB.prepare('SELECT COUNT(*) as user_count FROM users');
    const result = await stmt.first<{ user_count: number }>();
    return c.json({ count: result?.user_count || 0 });
  } catch (e: any) {
    if (e.message && e.message.includes('no such table')) {
        return c.json({ count: 0 });
    }
    throw e;
  }
});

app.post('/auth/setup-owner', async (c) => {
  const { username, email, password } = await c.req.json();
  
  await ensureTableAndColumns(c.env.DB, 'users', ['username', 'email', 'password_hash', 'role']);

  const stmt = c.env.DB.prepare('SELECT COUNT(*) as user_count FROM users');
  const result = await stmt.first<any>();
  const userCount = result ? (result.user_count || result['COUNT(*)'] || 0) : 0;
  
  if (userCount > 0) return c.json({ error: 'Setup already completed' }, 403);

  const password_hash = await bcrypt.hash(password, 10);
  
  await c.env.DB.prepare('INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), username, email, password_hash, 'owner')
    .run();
    
  return c.json({ success: true });
});

app.get('/debug/users', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT id, username, email, role FROM users').all();
    return c.json(results);
  } catch (e) {
    return c.json({ error: (e as any).message });
  }
});

app.post('/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  
  const { results } = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .all();
    
  if (results.length === 0) {
    return c.json({ success: false, message: 'Invalid credentials' });
  }
  
  const user = results[0] as any;
  const isMatch = await bcrypt.compare(password, user.password_hash);
  
  if (!isMatch) {
    return c.json({ success: false, message: 'Invalid credentials' });
  }
  
  return c.json({ success: true, user });
});

app.post('/auth/forgot-password', async (c) => {
  return c.json({ success: true });
});

app.post('/admin/create-user', async (c) => {
  const { username, email, password, role } = await c.req.json();
  const password_hash = await bcrypt.hash(password, 10);
  await c.env.DB.prepare('INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), username, email, password_hash, role)
    .run();
  return c.json({ success: true });
});

app.get('/backup', async (c) => {
  const backup: any = {};
  for (const table of ALLOWED_COLLECTIONS) {
      try {
        const { results } = await c.env.DB.prepare(`SELECT * FROM ${table}`).all();
        backup[table] = results;
      } catch (e) {
          // Ignore tables that don't exist
          backup[table] = [];
      }
  }
  return c.json(backup);
});

app.post('/restore', async (c) => {
    const data = await c.req.json();
    for (const table of ALLOWED_COLLECTIONS) {
        if (data[table] && data[table].length > 0) {
            const allKeys = new Set<string>();
            data[table].forEach((row: any) => Object.keys(row).forEach(k => allKeys.add(k)));
            await ensureTableAndColumns(c.env.DB, table, Array.from(allKeys));
            
            await c.env.DB.prepare(`DELETE FROM ${table}`).run();
            for (const row of data[table]) {
                const keys = Object.keys(row);
                const values = Object.values(row);
                await c.env.DB.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`)
                    .bind(...values)
                    .run();
            }
        }
    }
    return c.json({ success: true });
});

import { handle } from 'hono/cloudflare-pages';

export const onRequest = handle(app);

