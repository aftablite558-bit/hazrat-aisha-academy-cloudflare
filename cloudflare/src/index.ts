import { Hono } from 'hono';
import bcrypt from 'bcryptjs';

const app = new Hono<{ Bindings: { 
  DB: D1Database, 
  OWNER_NAME: string, 
  OWNER_EMAIL: string, 
  OWNER_USERNAME: string, 
  OWNER_PASSWORD: string 
} }>();

let setupChecked = false;

async function seedOwner(c: any) {
  try {
    const stmt = c.env.DB.prepare('SELECT COUNT(*) as user_count FROM users');
    const result = await stmt.first<{ user_count: number }>();
    
    if (result && result.user_count === 0) {
      const { OWNER_NAME, OWNER_EMAIL, OWNER_USERNAME, OWNER_PASSWORD } = c.env;
      
      if (OWNER_NAME && OWNER_EMAIL && OWNER_USERNAME && OWNER_PASSWORD) {
        const password_hash = await hashPassword(OWNER_PASSWORD);
        await c.env.DB.prepare('INSERT INTO users (id, name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?)')
          .bind(crypto.randomUUID(), OWNER_NAME, OWNER_EMAIL, password_hash, 'owner', 'active')
          .run();
        console.log('Owner account seeded successfully.');
      }
    }
  } catch (e) {
    console.error('Error seeding owner:', e);
  }
}

const ALLOWED_COLLECTIONS = [
  'users', 'students', 'staff', 'teachers', 'classes', 'subjects', 'attendance', 
  'homework', 'results', 'reportcards', 'admissions', 'fees', 'notices', 
  'gallery', 'documents', 'calendar', 'achievements', 'testimonials', 
  'audit_logs', 'settings', 'school_info', 'notifications', 'exam_marks', 'alumni', 'sections'
];

app.use(async (c, next) => {
  if (!setupChecked) {
    await seedOwner(c);
    setupChecked = true;
  }
  await next();
});

// Generic CRUD
app.get('/api/collection/:name', async (c) => {
  const name = c.req.param('name');
  if (!ALLOWED_COLLECTIONS.includes(name)) return c.json({ error: 'Unauthorized' }, 403);
  
  const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 50;
  const offset = c.req.query('offset') ? parseInt(c.req.query('offset')!) : 0;
  const search = c.req.query('search');
  
  let query = `SELECT * FROM ${name}`;
  const params: any[] = [];
  
  if (search) {
    // Basic search functionality - only applies to tables with relevant columns
    // A better approach would be to check table columns, but this fixes the immediate crash.
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

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

app.post('/api/collection/:name', async (c) => {
  const name = c.req.param('name');
  if (!ALLOWED_COLLECTIONS.includes(name)) return c.json({ error: 'Unauthorized' }, 403);
  
  const body = await c.req.json();
  
  if (name === 'users' && body.password) {
    body.password_hash = await hashPassword(body.password);
    delete body.password;
  }

  const keys = Object.keys(body);
  const values = Object.values(body);
  
  const result = await c.env.DB.prepare(`INSERT INTO ${name} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`)
    .bind(...values)
    .run();
    
  return c.json({ success: true, id: body.id || result.meta.last_row_id });
});

app.post('/api/collection/:name/:id/update', async (c) => {
  const name = c.req.param('name');
  const id = c.req.param('id');
  if (!ALLOWED_COLLECTIONS.includes(name)) return c.json({ error: 'Unauthorized' }, 403);
  
  const body = await c.req.json();
  
  if (name === 'users' && body.password) {
    body.password_hash = await hashPassword(body.password);
    delete body.password;
  }

  const setClause = Object.keys(body).map(key => `${key} = ?`).join(', ');
  
  await c.env.DB.prepare(`UPDATE ${name} SET ${setClause} WHERE id = ?`)
    .bind(...Object.values(body), id)
    .run();
    
  return c.json({ success: true });
});

app.post('/api/collection/:name/:id/delete', async (c) => {
  const name = c.req.param('name');
  const id = c.req.param('id');
  if (!ALLOWED_COLLECTIONS.includes(name)) return c.json({ error: 'Unauthorized' }, 403);
  
  await c.env.DB.prepare(`DELETE FROM ${name} WHERE id = ?`)
    .bind(id)
    .run();
    
  return c.json({ success: true });
});

// Auth
app.get('/api/auth/check-setup', async (c) => {
  const stmt = c.env.DB.prepare('SELECT COUNT(*) as user_count FROM users');
  const result = await stmt.first<{ user_count: number }>();
  return c.json({ count: result?.user_count || 0 });
});

app.post('/api/auth/setup-owner', async (c) => {
  const { name, email, password } = await c.req.json();
  
  const stmt = c.env.DB.prepare('SELECT COUNT(*) as user_count FROM users');
  const result = await stmt.first<{ user_count: number }>();
  
  if (result && result.user_count > 0) return c.json({ error: 'Setup already completed' }, 403);

  const password_hash = await hashPassword(password);
  
  await c.env.DB.prepare('INSERT INTO users (id, name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), name, email, password_hash, 'owner', 'active')
    .run();
    
  return c.json({ success: true });
});

app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  
  const { results } = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .all();
    
  if (results.length === 0) return c.json({ success: false, message: 'Invalid credentials' });
  
  const user = results[0] as any;
  const isMatch = await bcrypt.compare(password, user.password_hash);
  
  if (!isMatch) return c.json({ success: false, message: 'Invalid credentials' });
  
  return c.json({ success: true, user });
});

app.post('/api/auth/forgot-password', async (c) => {
  return c.json({ success: true });
});

app.post('/api/admin/create-user', async (c) => {
  const { name, email, password, role, status } = await c.req.json();
  const password_hash = await hashPassword(password);
  await c.env.DB.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), name, email, password_hash, role)
    .run();
  return c.json({ success: true });
});

app.get('/api/backup', async (c) => {
  const backup: any = {};
  for (const table of ALLOWED_COLLECTIONS) {
      const { results } = await c.env.DB.prepare(`SELECT * FROM ${table}`).all();
      backup[table] = results;
  }
  return c.json(backup);
});

app.post('/api/restore', async (c) => {
    const data = await c.req.json();
    for (const table of ALLOWED_COLLECTIONS) {
        if (data[table]) {
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

export default app;
