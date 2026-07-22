const fs = require('fs');
let file = 'functions/api/[[path]].ts';
let c = fs.readFileSync(file, 'utf8');

const oldCreate = `app.post('/admin/create-user', async (c) => {
  const body = await c.req.json();
  const { username, email, password, role, displayName, status } = body;
  const password_hash = await bcrypt.hash(password, 10);
  await ensureTableAndColumns(c.env.DB, "users", ["id", "username", "email", "password_hash", "role", "displayName", "status"]);
  await c.env.DB.prepare('INSERT INTO users (id, username, email, password_hash, role, displayName, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), username, email, password_hash, role, displayName, status)
    .run();
  return c.json({ success: true });
});`;

const newCreate = `app.post('/admin/create-user', async (c) => {
  const body = await c.req.json();
  const { username, email, password, role, displayName, status } = body;
  const password_hash = await bcrypt.hash(password, 10);
  const userRole = role || 'user';
  const userStatus = status || 'active';
  const createdAt = new Date().toISOString();
  await ensureTableAndColumns(c.env.DB, "users", ["id", "username", "email", "password_hash", "role", "displayName", "status", "createdAt"]);
  await c.env.DB.prepare('INSERT INTO users (id, username, email, password_hash, role, displayName, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), username, email, password_hash, userRole, displayName, userStatus, createdAt)
    .run();
  return c.json({ success: true });
});`;

c = c.replace(oldCreate, newCreate);
fs.writeFileSync(file, c);
