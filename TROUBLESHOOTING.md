# 🔧 Troubleshooting Guide - Phase 3 WebUI

## Common Issues & Solutions

---

### 🚫 "Cannot GET /api/auth/login"

**Problem:** Frontend can't reach backend API

**Solutions:**

1. **Check backend is running:**
   ```bash
   cd Server/node
   node index-v2.js
   ```
   Should see: `Server running on port 3000`

2. **Check backend port:**
   Backend should be on port `3000` (default)

3. **Check Vite proxy config:**
   `client/vite.config.js` should have:
   ```javascript
   proxy: {
     '/api': {
       target: 'http://localhost:3000',
       changeOrigin: true
     }
   }
   ```

4. **Clear Vite cache:**
   ```bash
   cd client
   rm -rf node_modules/.vite
   npm run dev
   ```

---

### 🔑 "Invalid credentials" (but they're correct)

**Problem:** Database not initialized or credentials don't match

**Solutions:**

1. **Reset database:**
   ```bash
   cd Server/node
   rm -rf data/
   node index-v2.js
   ```
   Database will recreate with default `admin/admin`

2. **Check for typos:**
   - Username is case-sensitive
   - No extra spaces
   - Default: `admin` / `admin` (lowercase)

3. **Check backend logs:**
   Backend should show login attempts:
   ```
   POST /api/auth/login 401 - "Invalid credentials"
   ```

---

### 🔌 WebSocket not connecting

**Problem:** Real-time updates not working, status shows "Disconnected"

**Solutions:**

1. **Check browser console (F12):**
   Look for Socket.IO errors:
   ```
   WebSocket connection failed
   ```

2. **Check JWT token:**
   Open DevTools → Application → Local Storage → `http://localhost:5173`
   Should see `token` key with JWT value

3. **Check backend WebSocket server:**
   Backend should show:
   ```
   Socket.IO server initialized
   ```

4. **Check proxy config:**
   `client/vite.config.js` should proxy WebSocket:
   ```javascript
   '/socket.io': {
     target: 'http://localhost:3000',
     ws: true
   }
   ```

5. **Try reconnecting:**
   - Logout and login again
   - Refresh page
   - Restart backend

---

### 📦 "Cannot find module '@vueform/vueform'"

**Problem:** Vueform not installed

**Solutions:**

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **If peer dependency errors:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Clear cache and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

---

### 🎨 Vueform elements not rendering

**Problem:** Form components show as plain inputs

**Solutions:**

1. **Check Vueform is registered:**
   `client/src/main.js` should have:
   ```javascript
   import Vueform from '@vueform/vueform'
   import vueformConfig from './vueform.config'
   app.use(Vueform, vueformConfig)
   ```

2. **Check Vueform config:**
   `client/src/vueform.config.js` should exist

3. **Check component imports:**
   Components should use Vueform elements:
   ```vue
   <TextElement name="username" ... />
   ```

4. **Check for license warnings:**
   Vueform open-source is free, but check console for warnings

---

### 🔄 "Failed to fetch" on login

**Problem:** Network request fails completely

**Solutions:**

1. **Check CORS:**
   Backend should allow `localhost:5173`:
   ```javascript
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true
   }))
   ```

2. **Check firewall:**
   - Allow port 3000 (backend)
   - Allow port 5173 (frontend)

3. **Check browser network tab:**
   - DevTools → Network
   - See if request reaches backend
   - Check response status code

4. **Test backend directly:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin"}'
   ```

---

### 🚪 Logged out immediately after login

**Problem:** Token not persisting or immediately invalid

**Solutions:**

1. **Check localStorage:**
   - DevTools → Application → Local Storage
   - Token should persist after login

2. **Check token expiry:**
   Backend `.env` should have reasonable expiry:
   ```env
   JWT_EXPIRES_IN=7d
   ```

3. **Check auth store:**
   `client/src/stores/auth.js` should save token:
   ```javascript
   localStorage.setItem('token', this.token)
   ```

4. **Check API interceptor:**
   `client/src/api.js` should add token to requests:
   ```javascript
   config.headers.Authorization = `Bearer ${authStore.token}`
   ```

---

### 📊 Components page shows no data

**Problem:** Component list is empty

**Solutions:**

1. **Check if Q-SYS is connected to backend:**
   Backend needs Q-SYS WebSocket connection

2. **Check cache:**
   Backend caches components when they're first seen
   - Send a message from Q-SYS to backend
   - Subscribe to a component

3. **Check API response:**
   ```bash
   curl http://localhost:3000/api/components \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Check browser console:**
   Look for fetch errors

---

### 🛠️ "npm run dev" fails

**Problem:** Vite dev server won't start

**Solutions:**

1. **Check Node.js version:**
   ```bash
   node --version
   ```
   Need Node 18+ for Vite 5

2. **Port 5173 already in use:**
   ```bash
   # Kill process on port 5173
   lsof -ti:5173 | xargs kill -9
   ```

3. **Check for syntax errors:**
   Look at error message for file path

4. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   ```

---

### 🏗️ "npm run build" fails

**Problem:** Production build errors

**Solutions:**

1. **Check for TypeScript errors:**
   (If you added TypeScript later)

2. **Check for missing imports:**
   All components must be properly imported

3. **Check Vite config:**
   `vite.config.js` should be valid

4. **Try clean build:**
   ```bash
   rm -rf dist node_modules/.vite
   npm run build
   ```

---

### 🔐 "403 Forbidden" on admin actions

**Problem:** User doesn't have required role

**Solutions:**

1. **Check user role:**
   Settings page shows current role

2. **Check role in database:**
   ```bash
   cd Server/node
   sqlite3 data/bridge.db "SELECT * FROM users;"
   ```

3. **Login as admin:**
   Use `admin/admin` account

4. **Check auth store getters:**
   ```javascript
   authStore.isAdmin // should be true for admin actions
   authStore.isOperator // should be true for editing
   ```

---

## 🔍 Debug Mode

### Enable verbose logging

**Backend:**
Edit `index-v2.js`:
```javascript
// Add at top
process.env.DEBUG = 'socket.io:*'
```

**Frontend:**
Open browser console (F12) and run:
```javascript
localStorage.debug = '*'
```

### Check WebSocket events

**Browser console:**
```javascript
// Watch all Socket.IO events
const socket = io('http://localhost:3000')
socket.onAny((event, ...args) => {
  console.log('Socket event:', event, args)
})
```

---

## 📝 Useful Commands

### Backend

```bash
# Start backend
cd Server/node
node index-v2.js

# Check backend health
curl http://localhost:3000/health

# Check users
sqlite3 data/bridge.db "SELECT * FROM users;"

# Reset database
rm -rf data/
```

### Frontend

```bash
# Start dev server
cd Server/node/client
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache
rm -rf node_modules/.vite dist
```

### Both

```bash
# Start both servers
cd Server/node
./start-all.sh
```

---

## 🆘 Still Stuck?

1. **Check all READMEs:**
   - `PHASE3_README.md` (full guide)
   - `client/README.md` (client docs)
   - `PHASE2_README.md` (backend docs)

2. **Check browser console (F12):**
   - Look for red errors
   - Check Network tab for failed requests

3. **Check backend logs:**
   - Terminal running `node index-v2.js`
   - Look for errors or warnings

4. **Try fresh install:**
   ```bash
   cd Server/node
   rm -rf node_modules data
   npm install
   cd client
   rm -rf node_modules
   npm install --legacy-peer-deps
   cd ..
   ./start-all.sh
   ```

5. **Check versions:**
   ```bash
   node --version  # Need 18+
   npm --version
   ```

---

**Most issues are solved by:**
1. Ensuring backend is running (`node index-v2.js`)
2. Checking browser console for errors
3. Clearing caches and reinstalling
4. Using default credentials: `admin/admin`

---

**Good luck! 🍀**
