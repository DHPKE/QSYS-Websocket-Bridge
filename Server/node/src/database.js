const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const config = require('./config');

class DatabaseManager {
  constructor() {
    this.db = null;
  }
  
  initialize() {
    // Ensure data directory exists
    const dbDir = path.dirname(config.database.path);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    this.db = new Database(config.database.path);
    this.createTables();
    this.createDefaultUser();
  }
  
  createTables() {
    // Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'viewer',
        created_at INTEGER NOT NULL,
        last_login INTEGER
      )
    `);
    
    // API keys table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        last_used INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
    // Sessions table (optional, for tracking)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  }
  
  createDefaultUser() {
    const username = 'admin';
    const password = 'admin';
    
    const existing = this.db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    
    if (!existing) {
      const passwordHash = bcrypt.hashSync(password, 10);
      this.db.prepare(`
        INSERT INTO users (username, password_hash, role, created_at)
        VALUES (?, ?, ?, ?)
      `).run(username, passwordHash, 'admin', Date.now());
      
      console.log('\n⚠️  Default user created:');
      console.log('   Username: admin');
      console.log('   Password: admin');
      console.log('   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!\n');
    }
  }
  
  // User methods
  getUserByUsername(username) {
    return this.db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  }
  
  getUserById(id) {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }
  
  createUser(username, password, role = 'viewer') {
    const passwordHash = bcrypt.hashSync(password, 10);
    const result = this.db.prepare(`
      INSERT INTO users (username, password_hash, role, created_at)
      VALUES (?, ?, ?, ?)
    `).run(username, passwordHash, role, Date.now());
    
    return result.lastInsertRowid;
  }
  
  updateLastLogin(userId) {
    this.db.prepare('UPDATE users SET last_login = ? WHERE id = ?').run(Date.now(), userId);
  }
  
  verifyPassword(username, password) {
    const user = this.getUserByUsername(username);
    if (!user) return null;
    
    const valid = bcrypt.compareSync(password, user.password_hash);
    return valid ? user : null;
  }
  
  // API Key methods
  createApiKey(userId, name) {
    const key = 'qsys_' + require('crypto').randomBytes(32).toString('hex');
    this.db.prepare(`
      INSERT INTO api_keys (key, user_id, name, created_at)
      VALUES (?, ?, ?, ?)
    `).run(key, userId, name, Date.now());
    
    return key;
  }
  
  getApiKey(key) {
    return this.db.prepare('SELECT * FROM api_keys WHERE key = ?').get(key);
  }
  
  updateApiKeyUsage(key) {
    this.db.prepare('UPDATE api_keys SET last_used = ? WHERE key = ?').run(Date.now(), key);
  }
  
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = new DatabaseManager();
