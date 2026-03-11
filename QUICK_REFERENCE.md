# 📋 Quick Reference - Phase 3 WebUI

## 🚀 Quick Start (TL;DR)

```bash
# Backend
cd Server/node
npm install
cp .env.example .env  # Edit JWT_SECRET!
node index-v2.js

# Frontend (new terminal)
cd Server/node/client
npm install
npm run dev

# Visit: http://localhost:5173
# Login: admin / admin
```

**OR use the all-in-one script:**

```bash
cd Server/node
./start-all.sh
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `Server/node/index-v2.js` | Backend server |
| `Server/node/client/src/main.js` | Frontend entry point |
| `Server/node/.env` | Backend config (JWT secret) |
| `Server/node/client/vite.config.js` | Frontend dev server + proxy |

---

## 🌐 URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Backend API | http://localhost:3000 | REST API + WebSocket |
| Frontend Dev | http://localhost:5173 | Vue dev server |
| Health Check | http://localhost:3000/health | Backend status |

---

## 🔑 Default Credentials

```
Username: admin
Password: admin
```

⚠️ **Change immediately in production!**

---

## 👥 User Roles

| Role | View | Edit | Register Users |
|------|------|------|----------------|
| **viewer** | ✅ | ❌ | ❌ |
| **operator** | ✅ | ✅ | ❌ |
| **admin** | ✅ | ✅ | ✅ |

---

## 📦 NPM Scripts

### Backend (`Server/node`)

```bash
npm install          # Install dependencies
node index-v2.js     # Start server
```

### Frontend (`Server/node/client`)

```bash
npm install          # Install dependencies
npm run dev          # Dev server (hot reload)
npm run build        # Production build
npm run preview      # Preview production build
./setup.sh           # Quick setup + start
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/register` | Yes (admin) | Register user |
| GET | `/api/components` | Yes | List components |
| GET | `/api/stats` | Yes | Get statistics |
| GET | `/health` | No | Health check |

---

## 🔌 WebSocket Events

### Emit (Client → Server)

```javascript
socket.emit('qsys:subscribe', { component: 'Gain 1', controls: ['gain'] })
socket.emit('qsys:unsubscribe', { component: 'Gain 1', controls: ['gain'] })
socket.emit('qsys:control:set', { component: 'Gain 1', control: 'gain', value: -10.5 })
```

### Listen (Server → Client)

```javascript
socket.on('qsys:control:update', (data) => {
  console.log(data) // { component, control, value }
})
socket.on('qsys:error', (error) => {
  console.error(error)
})
```

---

## 🗂️ Project Structure (Simplified)

```
QSYS-Websocket-Bridge/
├── Server/node/
│   ├── index-v2.js              # Backend server ⚙️
│   ├── .env                     # Backend config 🔐
│   ├── src/                     # Backend modules
│   │   ├── auth.js              # JWT middleware
│   │   ├── database.js          # SQLite DB
│   │   └── state.js             # State manager
│   └── client/                  # Frontend 🎨
│       ├── src/
│       │   ├── views/           # Pages
│       │   ├── stores/          # Pinia state
│       │   └── composables/     # WebSocket logic
│       └── vite.config.js       # Dev server config
├── README.md                    # Main docs
├── PHASE3_SUMMARY.md            # Phase 3 overview
├── ARCHITECTURE.md              # System design
└── TROUBLESHOOTING.md           # Debug guide
```

---

## 🎨 Tech Stack

**Backend:**
- Node.js + Express
- Socket.IO (WebSocket)
- JWT (authentication)
- SQLite (database)

**Frontend:**
- Vue 3 (Composition API)
- Vueform (forms)
- Pinia (state)
- Vite (build tool)
- Axios (HTTP)
- Socket.IO Client (WebSocket)

---

## 🔧 Common Commands

### Start Both Servers

```bash
cd Server/node
./start-all.sh
```

### Reset Database

```bash
cd Server/node
rm -rf data/
node index-v2.js  # Creates fresh DB
```

### Clear Frontend Cache

```bash
cd Server/node/client
rm -rf node_modules/.vite dist
npm run dev
```

### Check Logs

```bash
# Backend logs (terminal running index-v2.js)
# Frontend logs (browser console F12)
```

---

## 🐛 Quick Debug Checklist

- [ ] Backend running? (`node index-v2.js`)
- [ ] Frontend running? (`npm run dev`)
- [ ] `.env` file exists with JWT_SECRET?
- [ ] Browser console errors? (F12)
- [ ] Token in localStorage? (F12 → Application)
- [ ] Backend shows Socket.IO connected?
- [ ] Using correct credentials? (`admin/admin`)

---

## 📚 Documentation Files

| File | What's Inside |
|------|---------------|
| **README.md** | Main project overview |
| **PHASE3_SUMMARY.md** | What Phase 3 built |
| **PHASE3_README.md** | Full Phase 3 guide |
| **PHASE3_CHECKLIST.md** | Implementation checklist |
| **ARCHITECTURE.md** | System architecture diagrams |
| **TROUBLESHOOTING.md** | Debug solutions |
| **client/README.md** | Frontend-specific docs |

---

## 💡 Pro Tips

1. **Use the all-in-one script:** `./start-all.sh`
2. **Check browser console first** when debugging
3. **Reset database** if login issues persist
4. **Use `--legacy-peer-deps`** if npm install fails
5. **Logout/login** to refresh WebSocket connection

---

## 🎯 Next Steps After Setup

1. ✅ Login with `admin/admin`
2. ✅ Create new user (Settings → Register)
3. ✅ Test different roles (viewer, operator)
4. ✅ Connect Q-SYS to backend
5. ✅ Watch real-time updates in Dashboard
6. ✅ Edit controls in Components page
7. ✅ Build for production (`npm run build`)

---

## 📞 Need Help?

1. Check **TROUBLESHOOTING.md**
2. Check browser console (F12)
3. Check backend terminal logs
4. Try fresh install:
   ```bash
   rm -rf node_modules data
   npm install
   ```

---

**Phase 3 Complete! Enjoy your Vue 3 WebUI! 🎉**
