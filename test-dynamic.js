import Database from "better-sqlite3";
const db = new Database(":memory:");
db.prepare("CREATE TABLE users (id TEXT PRIMARY KEY)").run();
db.prepare("ALTER TABLE users ADD COLUMN name TEXT").run();
console.log(db.prepare("PRAGMA table_info(users)").all());
