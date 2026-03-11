# Vue 3 WebUI Architecture

## 📁 File Structure & Relationships

```
client/
│
├── index.html ──────────────────► loads main.js
│
├── src/
│   │
│   ├── main.js ─────────┬──────► creates Vue app
│   │                    ├──────► imports App.vue
│   │                    ├──────► imports router.js
│   │                    ├──────► imports Pinia
│   │                    └──────► imports Vueform config
│   │
│   ├── App.vue ─────────────────► root component
│   │                             └──► <router-view />
│   │
│   ├── router.js ───────┬──────► defines routes
│   │                    ├──────► uses auth store
│   │                    └──────► route guards
│   │
│   ├── api.js ──────────┬──────► Axios instance
│   │                    ├──────► JWT interceptors
│   │                    └──────► auto-logout on 401
│   │
│   ├── vueform.config.js ───────► form validation rules
│   │
│   ├── stores/
│   │   ├── auth.js ─────┬──────► login/logout/register
│   │   │                ├──────► uses api.js
│   │   │                └──────► localStorage tokens
│   │   │
│   │   └── qsys.js ─────┬──────► components state
│   │                    ├──────► subscriptions
│   │                    ├──────► stats
│   │                    └──────► uses api.js
│   │
│   ├── composables/
│   │   └── useWebSocket.js ─────► Socket.IO logic
│   │                             ├──► connect/disconnect
│   │                             ├──► subscribe/unsubscribe
│   │                             ├──► setControl
│   │                             └──► updates qsys store
│   │
│   ├── components/
│   │   └── Navbar.vue ──────────► top navigation
│   │                             └──► uses auth store
│   │
│   └── views/
│       ├── Login.vue ───────────► login page
│       │                         ├──► uses Vueform
│       │                         └──► calls auth.login()
│       │
│       ├── Dashboard.vue ───────► overview page
│       │                         ├──► uses Navbar
│       │                         ├──► uses qsys store
│       │                         └──► uses WebSocket composable
│       │
│       ├── Components.vue ──────► control panel
│       │                         ├──► uses Navbar
│       │                         ├──► uses qsys store
│       │                         └──► uses WebSocket composable
│       │
│       └── Settings.vue ────────► settings page
│                                 ├──► uses Navbar
│                                 ├──► uses Vueform
│                                 ├──► uses auth store
│                                 └──► uses qsys store
│
└── vite.config.js ──────────────► dev server config
                                  └──► proxy to backend
```

---

## 🔄 Data Flow Diagrams

### Authentication Flow

```
User ──► Login.vue
         │
         ├─► Vueform validates
         │
         └─► auth.login(username, password)
             │
             ├─► api.post('/api/auth/login')
             │   │
             │   └─► Backend validates
             │       │
             │       └─► Returns JWT token
             │
             ├─► Store token in localStorage
             │
             ├─► Store user in Pinia
             │
             └─► Router redirects to Dashboard
```

### Real-Time Update Flow

```
Q-SYS ──► Backend (index-v2.js)
          │
          └─► Socket.IO emits 'qsys:control:update'
              │
              └─► Client receives event
                  │
                  └─► useWebSocket.js handles
                      │
                      └─► qsysStore.updateComponentValue()
                          │
                          └─► Vue reactivity updates UI
                              │
                              └─► Dashboard.vue
                                  Components.vue
                                  (auto-refresh)
```

### Control Edit Flow

```
User ──► Components.vue
         │
         ├─► Input value changes
         │
         └─► updateControl(component, control, value)
             │
             └─► useWebSocket.setControl()
                 │
                 └─► socket.emit('qsys:control:set')
                     │
                     └─► Backend receives
                         │
                         └─► Sends to Q-SYS
                             │
                             └─► Broadcasts update to all clients
                                 │
                                 └─► All UIs update (real-time)
```

---

## 🔐 Route Guard Flow

```
User navigates ──► router.js beforeEach()
                   │
                   ├─► Check meta.requiresAuth?
                   │   │
                   │   ├─► Yes ──► authStore.isAuthenticated?
                   │   │          │
                   │   │          ├─► Yes ──► Allow navigation
                   │   │          │
                   │   │          └─► No ──► Redirect to /login
                   │   │
                   │   └─► No ──► Allow navigation
                   │
                   └─► Check meta.requiresGuest?
                       │
                       ├─► Yes ──► authStore.isAuthenticated?
                       │          │
                       │          ├─► Yes ──► Redirect to /
                       │          │
                       │          └─► No ──► Allow navigation
                       │
                       └─► No ──► Allow navigation
```

---

## 🗂️ State Management (Pinia)

### auth.js Store

```javascript
{
  state: {
    user: { username, role },
    token: "jwt-token-here"
  },
  
  getters: {
    isAuthenticated: boolean,
    isAdmin: boolean,
    isOperator: boolean
  },
  
  actions: {
    login(username, password),
    register(username, password, role),
    logout(),
    checkAuth()
  }
}
```

### qsys.js Store

```javascript
{
  state: {
    components: [
      {
        name: "Gain 1",
        controls: [
          { name: "gain", value: -10.5, timestamp: 1710195000 }
        ]
      }
    ],
    subscriptions: ["component:control"],
    stats: { messagesSent, messagesReceived, ... },
    connected: boolean,
    loading: boolean
  },
  
  getters: {
    componentByName(name),
    controlValue(componentName, controlName)
  },
  
  actions: {
    fetchComponents(),
    fetchSubscriptions(),
    fetchStats(),
    getControlHistory(component, control),
    updateComponentValue(component, control, value),
    setConnected(status)
  }
}
```

---

## 🌐 API Endpoints Used

| Method | Endpoint | View/Store | Purpose |
|--------|----------|------------|---------|
| POST | `/api/auth/login` | Login.vue | Authenticate user |
| POST | `/api/auth/register` | Settings.vue | Create user (admin) |
| GET | `/api/components` | Dashboard.vue, Components.vue | Fetch cached components |
| GET | `/api/stats` | Dashboard.vue | Get system statistics |
| GET | `/api/subscriptions` | Settings.vue | List active subs |
| GET | `/health` | auth.js | Check token validity |

---

## 🔌 WebSocket Events

### Client → Server

| Event | Payload | Purpose |
|-------|---------|---------|
| `qsys:subscribe` | `{ component, controls }` | Subscribe to updates |
| `qsys:unsubscribe` | `{ component, controls }` | Unsubscribe |
| `qsys:control:set` | `{ component, control, value }` | Update control |

### Server → Client

| Event | Payload | Purpose |
|-------|---------|---------|
| `connect` | - | WebSocket connected |
| `disconnect` | - | WebSocket disconnected |
| `qsys:control:update` | `{ component, control, value }` | Control changed |
| `qsys:error` | `{ error }` | Error occurred |

---

## 🎨 Component Hierarchy

```
App.vue
│
├─► router-view
    │
    ├─► Login.vue
    │   └─► Vueform elements
    │       ├─► TextElement (username)
    │       ├─► TextElement (password, type=password)
    │       └─► ButtonElement (submit)
    │
    ├─► Dashboard.vue
    │   ├─► Navbar.vue
    │   ├─► Stats grid (stat cards)
    │   └─► Recent components list
    │
    ├─► Components.vue
    │   ├─► Navbar.vue
    │   └─► Component cards
    │       └─► Control rows (inputs)
    │
    └─► Settings.vue
        ├─► Navbar.vue
        ├─► User info card
        ├─► Registration form (Vueform, admin only)
        └─► Connection status card
```

---

## 📦 Dependency Graph

```
Vue 3 ────┬──► App rendering
          ├──► Composition API
          └──► Reactivity system

Pinia ────┬──► auth store
          └──► qsys store

Vue Router ───► Route management + guards

Vueform ──────► Form components + validation

Axios ────┬──► HTTP requests
          ├──► Interceptors (JWT)
          └──► Error handling

Socket.IO ────► Real-time WebSocket connection

Vite ─────┬──► Dev server
          ├──► HMR (Hot Module Replacement)
          ├──► API proxy
          └──► Production bundler
```

---

**Use this as a reference for understanding the architecture! 📚**
