# Phase 2: REST API + Authentication - Complete!

## ✨ New Features

### 🔐 Authentication System
- **JWT token-based authentication**
- **API key support** for integrations
- **Role-based access control** (admin, operator, viewer)
- **SQLite database** for user management
- **bcrypt password hashing**

### 🌐 REST API
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/register` - Register new user
- `GET /api/components` - List all cached components
- `GET /api/component/:name` - Get component details
- `GET /api/component/:name/:control` - Get control value from cache
- `GET /api/component/:name/:control/history` - Get value history
- `GET /api/subscriptions` - List active subscriptions
- `GET /api/stats` - Get state statistics
- `GET /health` - Health check endpoint

### 📊 Enhanced State Management
- **Component cache** with timestamps
- **Value history** tracking (last 100 values)
- **Subscription manager** with client tracking
- **Cache statistics** (hits/misses)
- **Multi-client subscription deduplication**

### ⚙️ Configuration System
- **.env file** for configuration
- **Environment variables** for all settings
- **CORS configuration**
- **Rate limiting** (100 req/15min by default)
- **Security headers** (helmet)

---

## 📦 Installation

### 1. Install Dependencies

```bash
cd Server/node
npm install
```

**New dependencies:**
- `express` - REST API framework
- `cors` - Cross-Origin Resource Sharing
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `better-sqlite3` - Database
- `dotenv` - Environment configuration
- `express-rate-limit` - API rate limiting
- `helmet` - Security headers

### 2. Configure Environment

```bash
cp .env.example .env
```

**Edit `.env`** and change:
```env
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
```

### 3. Start Server

```bash
# Old version (Phase 1)
node index.js

# New version (Phase 2)
node index-v2.js
```

**Default credentials:**
- Username: `admin`
- Password: `admin`
- ⚠️ **CHANGE THIS IN PRODUCTION!**

---

## 🔐 Authentication Examples

### Login via REST API

```javascript
// Login
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Token:', data.token);
  console.log('User:', data.user);
  
  // Save token
  localStorage.setItem('token', data.token);
});
```

### Use Token for API Requests

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:3000/api/components', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('Components:', data));
```

### Register New User

```javascript
fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'operator',
    password: 'securePassword123',
    role: 'operator'  // admin, operator, or viewer
  })
})
.then(r => r.json())
.then(data => console.log('Registered:', data));
```

---

## 🌐 REST API Usage

### Get All Components (from cache)

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/components
```

**Response:**
```json
{
  "components": [
    {
      "name": "Gain 1",
      "controls": [
        { "name": "gain", "value": -10.5, "timestamp": 1710195000 }
      ]
    }
  ]
}
```

### Get Control Value

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/component/Gain%201/gain
```

**Response:**
```json
{
  "component": "Gain 1",
  "control": "gain",
  "value": -10.5,
  "timestamp": 1710195000
}
```

### Get Value History

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/component/Gain%201/gain/history?limit=50"
```

**Response:**
```json
{
  "component": "Gain 1",
  "control": "gain",
  "history": [
    { "value": -12.0, "timestamp": 1710194800 },
    { "value": -10.5, "timestamp": 1710195000 }
  ]
}
```

### Get Statistics

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/stats
```

**Response:**
```json
{
  "messagesSent": 450,
  "messagesReceived": 120,
  "errors": 0,
  "cacheHits": 80,
  "cacheMisses": 40,
  "components": 5,
  "subscriptions": 3,
  "cacheSize": 12
}
```

---

## 🔑 Roles & Permissions

| Role | Permissions |
|------|-------------|
| **admin** | Full access (read, write, manage users) |
| **operator** | Read + Write Q-SYS controls |
| **viewer** | Read-only access |

---

## 🆚 Phase 1 vs Phase 2 Comparison

| Feature | Phase 1 | Phase 2 |
|---------|---------|---------|
| **WebSocket** | ✅ | ✅ |
| **REST API** | ❌ | ✅ |
| **Authentication** | ❌ | ✅ JWT + API Keys |
| **User Management** | ❌ | ✅ SQLite DB |
| **State Cache** | Basic | ✅ Enhanced with history |
| **Subscriptions** | Basic | ✅ Managed with tracking |
| **Configuration** | Inline | ✅ .env file |
| **Rate Limiting** | ❌ | ✅ |
| **Security Headers** | ❌ | ✅ Helmet |
| **CORS** | ❌ | ✅ Configurable |
| **Statistics** | Basic | ✅ Detailed |

---

## 📁 New File Structure

```
Server/node/
├── index.js          ← Phase 1 (original)
├── index-v2.js       ← Phase 2 (new) 🆕
├── package.json      ← Updated dependencies
├── .env              ← Configuration (create from .env.example)
├── .env.example      ← Example configuration 🆕
├── data/             ← Database directory (auto-created) 🆕
│   └── bridge.db     ← SQLite database
└── src/              ← Modular code 🆕
    ├── config.js     ← Configuration loader
    ├── database.js   ← Database manager
    ├── auth.js       ← Authentication middleware
    ├── state.js      ← State management
    └── routes/       ← API routes
        ├── auth.js   ← Auth endpoints
        └── qsys.js   ← Q-SYS endpoints
```

---

## 🚀 Next Steps

1. ✅ Test REST API with Postman or curl
2. ✅ Create additional users (operators, viewers)
3. ✅ Generate API keys for integrations
4. ⏸️ **Phase 3**: Build WebUI using this REST API
5. ⏸️ **Phase 5**: Package as native apps

---

## 🐛 Troubleshooting

### "Cannot find module 'better-sqlite3'"

```bash
npm install
```

### "ENOENT: no such file or directory, open '.env'"

```bash
cp .env.example .env
```

### "Invalid credentials" on login

Default credentials:
- Username: `admin`
- Password: `admin`

### Database errors

Delete and recreate:
```bash
rm -rf data/
node index-v2.js  # Will auto-create
```

---

**Phase 2 Status**: ✅ Complete!  
**Ready for**: Phase 3 (WebUI development)
