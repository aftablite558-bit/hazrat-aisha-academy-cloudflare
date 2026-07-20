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
    console.log('Checking for existing owner...');
    const stmt = c.env.DB.prepare('SELECT COUNT(*) as user_count FROM users');
    const result = await stmt.first<any>();
    console.log('User count result:', result);
    
    // Some D1 drivers return the count directly or as a key named 'COUNT(*)'
    const userCount = result ? (result.user_count || result['COUNT(*)'] || 0) : 0;
    
    if (userCount === 0) {
      const { OWNER_EMAIL, OWNER_USERNAME, OWNER_PASSWORD } = c.env;
      console.log('Seeding owner:', OWNER_EMAIL);
      
      if (OWNER_EMAIL && OWNER_USERNAME && OWNER_PASSWORD) {
        const password_hash = await hashPassword(OWNER_PASSWORD);
        console.log('Hashing password for owner:', OWNER_EMAIL);
        await c.env.DB.prepare('INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)')
          .bind(crypto.randomUUID(), OWNER_USERNAME, OWNER_EMAIL, password_hash, 'owner')
          .run();
        console.log('Owner account seeded successfully.');
      } else {
        console.log('Missing owner environment variables:', { OWNER_EMAIL: !!OWNER_EMAIL, OWNER_USERNAME: !!OWNER_USERNAME, OWNER_PASSWORD: !!OWNER_PASSWORD });
      }
    } else {
      console.log('Owner account already exists, count:', userCount);
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
  const { username, email, password } = await c.req.json();
  
  const stmt = c.env.DB.prepare('SELECT COUNT(*) as user_count FROM users');
  const result = await stmt.first<any>();
  const userCount = result ? (result.user_count || result['COUNT(*)'] || 0) : 0;
  
  if (userCount > 0) return c.json({ error: 'Setup already completed' }, 403);

  const password_hash = await hashPassword(password);
  
  await c.env.DB.prepare('INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), username, email, password_hash, 'owner')
    .run();
    
  return c.json({ success: true });
});

app.get('/api/debug/users', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT id, username, email, role FROM users').all();
    return c.json(results);
  } catch (e) {
    return c.json({ error: (e as any).message });
  }
});

app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  console.log('Login attempt for email:', email);
  
  const { results } = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .all();
    
  if (results.length === 0) {
    console.log('Login failed: User not found for email:', email);
    return c.json({ success: false, message: 'Invalid credentials' });
  }
  
  const user = results[0] as any;
  console.log('User found, verifying password hash for:', user.id);
  const isMatch = await bcrypt.compare(password, user.password_hash);
  
  if (!isMatch) {
    console.log('Login failed: Password mismatch for user:', user.id);
    return c.json({ success: false, message: 'Invalid credentials' });
  }
  
  console.log('Login successful for user:', user.id);
  return c.json({ success: true, user });
});

app.post('/api/auth/forgot-password', async (c) => {
  return c.json({ success: true });
});

app.post('/api/admin/create-user', async (c) => {
  const { username, email, password, role } = await c.req.json();
  const password_hash = await hashPassword(password);
  await c.env.DB.prepare('INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), username, email, password_hash, role)
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
