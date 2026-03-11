# Q-SYS Bridge WebUI (Vue 3 + Vueform)

Modern control interface for the Q-SYS WebSocket Bridge built with Vue 3, Vite, and Vueform.

## ✨ Features

- 🔐 **JWT Authentication** - Secure login with role-based access
- 📊 **Real-time Dashboard** - Live stats and component monitoring
- 🎛️ **Component Control** - View and edit Q-SYS controls (operators+)
- ⚙️ **Settings Panel** - User management and connection status
- 🌐 **WebSocket Integration** - Real-time updates from Q-SYS
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Phase 2 backend running (`index-v2.js`)

### Installation

```bash
cd client
npm install
```

### Development

```bash
npm run dev
```

Visit: http://localhost:5173

**Default credentials:**
- Username: `admin`
- Password: `admin`

### Production Build

```bash
npm run build
```

Output: `dist/` folder ready to deploy

## 📁 Project Structure

```
client/
├── src/
│   ├── components/       # Reusable components
│   │   └── Navbar.vue
│   ├── views/           # Page components
│   │   ├── Login.vue
│   │   ├── Dashboard.vue
│   │   ├── Components.vue
│   │   └── Settings.vue
│   ├── stores/          # Pinia state management
│   │   ├── auth.js
│   │   └── qsys.js
│   ├── composables/     # Vue composables
│   │   └── useWebSocket.js
│   ├── api.js           # Axios config
│   ├── router.js        # Vue Router
│   ├── vueform.config.js
│   ├── App.vue
│   └── main.js
├── public/              # Static assets
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Tech Stack

- **Vue 3** - Composition API
- **Vite** - Lightning-fast dev server
- **Vueform** - Beautiful form components
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - WebSocket connection

## 🔑 Roles & Permissions

| Role | Dashboard | View Components | Edit Controls | User Management |
|------|-----------|-----------------|---------------|-----------------|
| **viewer** | ✅ | ✅ | ❌ | ❌ |
| **operator** | ✅ | ✅ | ✅ | ❌ |
| **admin** | ✅ | ✅ | ✅ | ✅ |

## 🌐 API Proxy

Vite dev server proxies API requests:

- `/api/*` → `http://localhost:3000/api/*`
- `/socket.io/*` → `http://localhost:3000/socket.io/*`

Configure in `vite.config.js` if backend runs elsewhere.

## 📦 Vueform License

This project uses **@vueform/vueform** (open-source version). For production with advanced features, consider a [Vueform license](https://vueform.com/pricing).

## 🐛 Troubleshooting

### "Failed to fetch" on login

- Ensure backend (`index-v2.js`) is running on port 3000
- Check proxy config in `vite.config.js`

### WebSocket not connecting

- Verify backend WebSocket server is running
- Check browser console for connection errors
- Ensure JWT token is valid (check localStorage)

### Vueform components not rendering

```bash
npm install @vueform/vueform --legacy-peer-deps
```

## 📸 Screenshots

### Login
Clean authentication with Vueform elements

### Dashboard
Real-time stats and component overview

### Components
Browse and control Q-SYS components

### Settings
User management and system status

## 🚀 Next Steps

- [ ] Add component search/filter
- [ ] Value history charts
- [ ] Dark/light theme toggle
- [ ] Mobile app wrapper (Capacitor)
- [ ] Advanced control types (sliders, toggles)
- [ ] Subscription management UI

## 📄 License

MIT - See [LICENSE](../LICENSE)

---

**Built with ❤️ using Vue 3 + Vueform**
