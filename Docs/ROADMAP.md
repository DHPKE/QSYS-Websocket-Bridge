# Development Roadmap

## Phase Overview

| Phase | Component | Duration | Dependencies |
|-------|-----------|----------|--------------|
| 1 | Q-SYS Plugin + Node.js Bridge | 2 weeks | None |
| 2 | REST API + State Management | 2 weeks | Phase 1 |
| 3 | WebUI (React/Vue) | 2 weeks | Phase 2 |
| 4 | Node-RED Integration | 1 week | Phase 1 |
| 5 | Kiosk Apps (Desktop + Mobile) | 3 weeks | Phase 3 |

**Total Estimated Time**: 10 weeks

---

## Phase 1: Core Bridge (Weeks 1-2) ⚡ START HERE

### Goal
Establish reliable bidirectional communication between Q-SYS and Node.js server.

### Tasks

#### Q-SYS Plugin
- [x] Initialize project structure
- [ ] Create `QSYS-Websocket-Bridge.qplug`
- [ ] Implement WebSocket client (connect to Node.js)
- [ ] Component access API (`Component.New()`)
- [ ] Message protocol (JSON parsing/encoding)
- [ ] Get/Set value handlers
- [ ] Subscribe/Unsubscribe handlers
- [ ] Component discovery
- [ ] Error handling
- [ ] Debug logging
- [ ] Keep-alive (ping/pong)
- [ ] Auto-reconnect logic

#### Node.js Bridge Server
- [ ] Initialize Node.js project (`npm init`)
- [ ] Install dependencies (`ws`, `express`)
- [ ] WebSocket server setup
- [ ] Handle Q-SYS connection
- [ ] Route messages (get/set/subscribe)
- [ ] Basic state cache
- [ ] Configuration file
- [ ] Logging system

#### Testing
- [ ] Test Q-SYS plugin in Designer
- [ ] Test Node.js server standalone
- [ ] Test bidirectional communication
- [ ] Test get/set operations
- [ ] Test subscribe/unsubscribe
- [ ] Test reconnect behavior

### Deliverables
- ✅ Working Q-SYS plugin
- ✅ Working Node.js server
- ✅ Reliable WebSocket communication
- ✅ Basic get/set/subscribe working
- ✅ Documentation

---

## Phase 2: Full Server (Weeks 3-4)

### Goal
Complete Node.js server with REST API, authentication, and multi-client support.

### Tasks

#### REST API
- [ ] Express/Fastify setup
- [ ] GET `/api/components` (list all)
- [ ] GET `/api/component/:name` (get details)
- [ ] GET `/api/component/:name/:control` (get value)
- [ ] POST `/api/component/:name/:control` (set value)
- [ ] POST `/api/subscribe` (subscribe to changes)
- [ ] DELETE `/api/subscribe/:id` (unsubscribe)
- [ ] OpenAPI/Swagger documentation

#### State Management
- [ ] State cache with TTL
- [ ] Value change notifications
- [ ] Subscription manager
- [ ] Multi-client broadcast

#### Authentication
- [ ] JWT token system
- [ ] User/password database (SQLite)
- [ ] Login endpoint
- [ ] Token validation middleware
- [ ] Role-based permissions

#### Configuration
- [ ] Config file (JSON/YAML)
- [ ] Q-SYS connection settings
- [ ] Server port/host settings
- [ ] Authentication settings
- [ ] Logging levels

### Deliverables
- ✅ Full REST API
- ✅ Authentication working
- ✅ State caching
- ✅ Multi-client support
- ✅ API documentation

---

## Phase 3: WebUI (Weeks 5-6)

### Goal
Create modular, real-time web interface for Q-SYS control.

### Tasks

#### Frontend Setup
- [ ] Initialize React/Vue project
- [ ] WebSocket client integration
- [ ] State management (Redux/Vuex)
- [ ] Routing
- [ ] Authentication flow

#### Core Components
- [ ] Login page
- [ ] Component browser
- [ ] Component detail view
- [ ] Generic control widget
- [ ] Gain/Fader control
- [ ] Button control
- [ ] Meter display
- [ ] Text display/input

#### Real-Time Features
- [ ] WebSocket connection manager
- [ ] Auto-reconnect
- [ ] Value subscription
- [ ] Live updates
- [ ] Optimistic updates

#### UI/UX
- [ ] Responsive design
- [ ] Dark/light theme
- [ ] Drag-and-drop layout
- [ ] Save/load presets
- [ ] Touch-friendly controls

### Deliverables
- ✅ Working web interface
- ✅ Real-time control
- ✅ Component discovery
- ✅ Responsive design
- ✅ User guide

---

## Phase 4: Node-RED (Week 7)

### Goal
Enable visual programming for Q-SYS automation.

### Tasks

#### Custom Nodes
- [ ] `qsys-in` node (receive values)
- [ ] `qsys-out` node (send values)
- [ ] `qsys-get` node (query values)
- [ ] `qsys-set` node (set values)
- [ ] `qsys-component` node (component picker)
- [ ] `qsys-config` node (server config)

#### Node-RED Package
- [ ] NPM package structure
- [ ] Node HTML/JS files
- [ ] Node help documentation
- [ ] Package.json with node-red section
- [ ] Example flows

#### Testing
- [ ] Test all nodes
- [ ] Example flows (lighting, audio, automation)
- [ ] Documentation

### Deliverables
- ✅ Published NPM package
- ✅ 5+ working custom nodes
- ✅ Example flows
- ✅ Documentation

---

## Phase 5: Kiosk Apps (Weeks 8-10)

### Goal
Cross-platform applications for fullscreen Q-SYS control.

### Tasks

#### Electron App (Desktop)
- [ ] Electron project setup
- [ ] Load WebUI in BrowserWindow
- [ ] Fullscreen/kiosk mode
- [ ] Configuration UI
- [ ] Auto-launch on boot
- [ ] System tray icon
- [ ] Crash recovery
- [ ] Windows packaging (.exe)
- [ ] macOS packaging (.dmg)
- [ ] Linux packaging (.deb, .rpm, AppImage)

#### Mobile App (React Native/Capacitor)
- [ ] React Native or Capacitor setup
- [ ] WebView integration
- [ ] Native navigation
- [ ] Splash screen
- [ ] App icons
- [ ] Touch optimization
- [ ] Orientation support
- [ ] Android build (.apk)
- [ ] iOS build (.ipa)

#### Distribution
- [ ] GitHub Releases
- [ ] Windows installer (Inno Setup)
- [ ] macOS DMG with auto-install
- [ ] Linux packages (apt/yum)
- [ ] Google Play Store (optional)
- [ ] Apple App Store (optional)

### Deliverables
- ✅ Windows installer
- ✅ macOS installer
- ✅ Linux packages
- ✅ Android APK
- ✅ iOS IPA
- ✅ Installation guides

---

## Current Status

**Current Phase**: Phase 1, Task 1  
**Next Task**: Create Q-SYS WebSocket Bridge plugin

---

## Dependencies

### Q-SYS
- Q-SYS Designer 9.0+
- Basic Lua knowledge

### Node.js Server
- Node.js 18+
- npm/yarn

### WebUI
- Modern browser (Chrome, Firefox, Safari)
- ES6+ support

### Kiosk Apps
- Electron (for desktop)
- React Native or Capacitor (for mobile)
- Platform-specific build tools

---

## Next Steps

1. **Create Q-SYS plugin skeleton**
2. **Test WebSocket.New() in Q-SYS Designer**
3. **Create Node.js WebSocket server**
4. **Establish first connection**
5. **Implement get/set protocol**

Ready to start? 🚀
