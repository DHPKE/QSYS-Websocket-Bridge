# Phase 3: Vue 3 WebUI - Complete! ✅

## 🎉 What's New

A modern, responsive web interface for controlling Q-SYS via the WebSocket Bridge, built with:

- **Vue 3** (Composition API)
- **Vueform** (beautiful form components)
- **Pinia** (state management)
- **Socket.IO Client** (real-time WebSocket)
- **Vite** (blazing fast dev server)

---

## 📦 Installation

### 1. Navigate to Client Directory

```bash
cd Server/node/client
```

### 2. Install Dependencies

```bash
npm install
```

**Note:** If you encounter peer dependency issues with Vueform:

```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment (Optional)

```bash
cp .env.example .env
```

Edit `.env` if backend runs on a different URL:

```env
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Running the WebUI

### Development Mode

```bash
npm run dev
```

- Opens at: **http://localhost:5173**
- Hot reload enabled
- Dev tools integrated

### Production Build

```bash
npm run build
```

- Output: `dist/` folder
- Ready to deploy to any static host (Netlify, Vercel, S3, etc.)

### Preview Production Build

```bash
npm run preview
```

---

## 🔐 First Login

1. Ensure Phase 2 backend is running:
   ```bash
   cd Server/node
   node index-v2.js
   ```

2. Visit: **http://localhost:5173/login**

3. Login with default credentials:
   - **Username:** `admin`
   - **Password:** `admin`

⚠️ **Change the admin password immediately!** (via Settings page)

---

## 🎛️ Features Overview

### 1. **Login Page** 🔐
- Clean Vueform authentication
- JWT token-based login
- Auto-redirect after success

### 2. **Dashboard** 📊
- Real-time connection status
- Live statistics:
  - Messages sent/received
  - Components cached
  - Active subscriptions
- Recent component overview
- Auto-refresh every 5 seconds

### 3. **Components View** 🎚️
- Browse all cached Q-SYS components
- View control values with timestamps
- **Edit controls** (operators/admins only)
- Real-time updates via WebSocket
- Refresh button for manual sync

### 4. **Settings** ⚙️
- User information display
- **User registration** (admins only)
- Role-based access display
- Connection status monitoring
- Logout action

---

## 👥 User Roles & Permissions

| Role | Login | View Dashboard | View Components | Edit Controls | Register Users |
|------|-------|----------------|-----------------|---------------|----------------|
| **viewer** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **operator** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔄 WebSocket Integration

The WebUI automatically:

1. **Connects** to backend WebSocket on login
2. **Subscribes** to Q-SYS component updates
3. **Listens** for real-time control changes
4. **Updates** UI instantly when values change
5. **Sends** control changes back to Q-SYS (if operator/admin)

### Events Handled

- `connect` - WebSocket connected
- `disconnect` - WebSocket disconnected
- `qsys:control:update` - Control value changed
- `qsys:error` - Q-SYS error occurred

---

## 📁 File Structure Explained

```
client/
├── src/
│   ├── views/               # Main pages
│   │   ├── Login.vue        # Authentication page
│   │   ├── Dashboard.vue    # Stats & overview
│   │   ├── Components.vue   # Component control panel
│   │   └── Settings.vue     # User settings
│   │
│   ├── components/          # Reusable UI components
│   │   └── Navbar.vue       # Top navigation bar
│   │
│   ├── stores/              # Pinia state management
│   │   ├── auth.js          # Auth state (login, logout, tokens)
│   │   └── qsys.js          # Q-SYS state (components, subscriptions)
│   │
│   ├── composables/         # Vue composition functions
│   │   └── useWebSocket.js  # WebSocket connection logic
│   │
│   ├── api.js               # Axios HTTP client config
│   ├── router.js            # Vue Router routes + guards
│   ├── vueform.config.js    # Vueform configuration
│   ├── App.vue              # Root component
│   └── main.js              # App entry point
│
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite config (proxy, build)
├── package.json             # Dependencies
├── .env.example             # Environment template
└── README.md                # Documentation
```

---

## 🎨 Styling & Theme

### Color Scheme (Dark Mode)

```css
--primary: #3b82f6 (blue)
--success: #10b981 (green)
--warning: #f59e0b (orange)
--danger: #ef4444 (red)
--bg-primary: #0f172a (dark slate)
--bg-secondary: #1e293b (lighter slate)
--text-primary: #e2e8f0 (light gray)
--text-secondary: #94a3b8 (muted gray)
```

### Responsive Design

- Mobile: < 768px (stacked layouts)
- Tablet: 768px - 1024px
- Desktop: > 1024px (grid layouts)

---

## 🔧 Customization

### Change API URL

Edit `client/.env`:

```env
VITE_API_URL=https://your-backend.com
```

### Add New Routes

Edit `src/router.js`:

```javascript
{
  path: '/analytics',
  name: 'Analytics',
  component: () => import('./views/Analytics.vue'),
  meta: { requiresAuth: true }
}
```

### Add Vueform License Key

Edit `src/vueform.config.js`:

```javascript
export default {
  apiKey: 'YOUR_LICENSE_KEY_HERE',
  // ...
}
```

---

## 🐛 Troubleshooting

### Backend connection fails

**Problem:** API requests return errors

**Solution:**
1. Check backend is running: `node index-v2.js`
2. Verify port 3000 is open
3. Check proxy config in `vite.config.js`

### WebSocket not connecting

**Problem:** Real-time updates not working

**Solution:**
1. Open browser console (F12)
2. Check for Socket.IO errors
3. Verify JWT token in localStorage
4. Restart backend if needed

### Vueform components missing

**Problem:** Form elements not rendering

**Solution:**
```bash
npm install @vueform/vueform --legacy-peer-deps
```

### Token expired on refresh

**Problem:** Logged out after page reload

**Solution:**
- Tokens are stored in localStorage
- Check if `localStorage.getItem('token')` exists
- Backend may need longer token expiry

---

## 📊 API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | Register new user (admin) |
| GET | `/api/components` | Fetch cached components |
| GET | `/api/component/:name/:control` | Get control value |
| GET | `/api/component/:name/:control/history` | Get value history |
| GET | `/api/subscriptions` | List active subscriptions |
| GET | `/api/stats` | Get system statistics |
| GET | `/health` | Health check |

---

## 🚀 Deployment Options

### 1. **Static Hosting** (Recommended)

Build and deploy to:
- **Netlify**: Drag & drop `dist/` folder
- **Vercel**: Connect GitHub repo
- **AWS S3**: Upload to bucket + CloudFront
- **GitHub Pages**: Use `gh-pages` branch

```bash
npm run build
# Upload dist/ folder to your host
```

### 2. **Docker Container**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5173"]
```

### 3. **Serve from Backend**

Add to `index-v2.js`:

```javascript
app.use(express.static(path.join(__dirname, 'client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'))
})
```

---

## 🎯 Next Steps (Phase 4 Ideas)

- [ ] **Value History Charts** - Chart.js integration
- [ ] **Component Search** - Filter large component lists
- [ ] **Advanced Controls** - Sliders, toggles, buttons
- [ ] **Mobile App** - Capacitor wrapper for iOS/Android
- [ ] **Theme Switcher** - Light/dark mode toggle
- [ ] **Subscription Manager** - Add/remove subscriptions in UI
- [ ] **Error Notifications** - Toast messages for errors
- [ ] **Component Groups** - Organize components into folders
- [ ] **Quick Actions** - Preset control combinations
- [ ] **Audit Log** - Track who changed what

---

## ✅ Phase 3 Checklist

- [x] Vue 3 + Vite setup
- [x] Vueform integration
- [x] Pinia state management
- [x] Vue Router with auth guards
- [x] Login page with JWT auth
- [x] Dashboard with live stats
- [x] Components view with edit controls
- [x] Settings page with user management
- [x] WebSocket real-time integration
- [x] Responsive dark theme UI
- [x] API proxy configuration
- [x] Production build setup
- [x] Documentation

---

## 📝 Notes

- **No React used!** Pure Vue 3 Composition API
- **Vueform** handles all form validation & styling
- **Pinia** is the modern Vuex alternative (cleaner API)
- **Socket.IO Client** syncs with backend WebSocket events
- **Vite** provides instant HMR (Hot Module Replacement)

---

**Phase 3 Status:** ✅ **Complete!**  
**Ready for:** Phase 4 (Mobile apps, advanced features)

---

**Enjoy your new Q-SYS control interface! 🎉**
