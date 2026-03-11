# QSYS-Websocket-Bridge: Project Goals & Architecture

## Project Goals

### 1. Core WebSocket Bridge Plugin (Q-SYS)
- ✅ Establish solid, reliable connection to Q-SYS Core/Designer
- ✅ Bidirectional communication (read/write)
- ✅ Access **modules**, **values**, and **variables** directly
- ✅ **NO Named Controls required** in Q-SYS Designer
- ✅ Auto-reconnect, keep-alive, error handling

### 2. Node-RED Integration
- ✅ Node-RED ↔ Q-SYS bidirectional communication
- ✅ Custom Node-RED nodes for Q-SYS operations
- ✅ Visual programming for Q-SYS automation

### 3. Node.js WebUI
- ✅ Modular, component-based UI framework
- ✅ Real-time data read/write to Q-SYS
- ✅ Dynamic component discovery
- ✅ User authentication/authorization
- ✅ Responsive design (desktop + mobile)

### 4. Cross-Platform Kiosk Apps
- ✅ **Debian** (Linux)
- ✅ **Windows**
- ✅ **macOS**
- ✅ **Android**
- ✅ **iOS**
- ✅ Fullscreen kiosk mode
- ✅ Display Node.js WebUI
- ✅ Auto-start, crash recovery

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Q-SYS CORE/DESIGNER                      │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  WebSocket Bridge Plugin (Lua)                         │     │
│  │  - Component access (no Named Controls)                │     │
│  │  - Module/Value/Variable read/write                    │     │
│  │  - JSON API over WebSocket                             │     │
│  └────────────────────────────────────────────────────────┘     │
│                            ↕ WebSocket (ws/wss)                  │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NODE.JS SERVER (Bridge)                       │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  WebSocket Server                                      │     │
│  │  - Q-SYS connection manager                            │     │
│  │  - Message routing                                     │     │
│  │  - State cache/sync                                    │     │
│  └────────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  REST API                                              │     │
│  │  - Component discovery                                 │     │
│  │  - Value get/set endpoints                             │     │
│  │  - Authentication/sessions                             │     │
│  └────────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  WebUI Server (Express/Fastify)                        │     │
│  │  - Serve static UI files                               │     │
│  │  - Real-time WebSocket to clients                      │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    NODE-RED      │  │  WEB BROWSERS    │  │   KIOSK APPS     │
│  - Custom nodes  │  │  - Chrome/Safari │  │  - Electron      │
│  - Automation    │  │  - Mobile web    │  │  - React Native  │
│  - Flows/Logic   │  │  - Tablets       │  │  - Capacitor     │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## Technical Implementation Plan

### Phase 1: Q-SYS WebSocket Bridge Plugin

**File**: `Plugin/QSYS-Websocket-Bridge.qplug`

**Key Features**:
- WebSocket server (listens for incoming connections from Node.js)
- OR WebSocket client (connects to Node.js server)
- Component access via `Component.New(componentName)`
- Access controls/properties without Named Controls
- JSON message protocol

**Q-SYS Lua API Access**:
```lua
-- Access component directly
local comp = Component.New("Gain 1")
comp["gain"].Value = -10  -- Set gain to -10dB

-- Read value
local currentGain = comp["gain"].Value

-- Access variables (if component supports)
local var = comp.Variables["myVariable"]
```

**Message Protocol** (JSON):
```json
// Request: Read value
{
  "id": 1,
  "type": "get",
  "component": "Gain 1",
  "control": "gain"
}

// Response
{
  "id": 1,
  "status": "ok",
  "value": -10.5
}

// Request: Write value
{
  "id": 2,
  "type": "set",
  "component": "Gain 1",
  "control": "gain",
  "value": -15.0
}

// Response
{
  "id": 2,
  "status": "ok"
}

// Request: List components
{
  "id": 3,
  "type": "list"
}

// Response
{
  "id": 3,
  "status": "ok",
  "components": [
    {"name": "Gain 1", "type": "gain"},
    {"name": "Mixer 1", "type": "mixer"}
  ]
}
```

---

### Phase 2: Node.js Bridge Server

**Directory**: `Server/node/`

**Stack**:
- **Framework**: Express.js or Fastify
- **WebSocket**: `ws` library
- **Protocol**: JSON
- **Database**: SQLite (for config/sessions)
- **Auth**: JWT tokens

**Features**:
- WebSocket client to Q-SYS plugin
- WebSocket server for web clients
- REST API for HTTP requests
- State caching (reduce Q-SYS queries)
- Multi-client support
- Authentication/authorization

**Modules**:
```
server/
├── src/
│   ├── qsys-client.js       # WebSocket client to Q-SYS
│   ├── websocket-server.js  # WebSocket server for web clients
│   ├── rest-api.js          # REST endpoints
│   ├── state-manager.js     # State cache/sync
│   ├── auth.js              # Authentication
│   └── config.js            # Configuration
├── config/
│   └── default.json         # Default settings
└── package.json
```

---

### Phase 3: Node-RED Integration

**Directory**: `Server/node-red/`

**Custom Nodes**:
1. **qsys-in**: Receive value changes from Q-SYS
2. **qsys-out**: Send values to Q-SYS
3. **qsys-get**: Query Q-SYS values
4. **qsys-set**: Set Q-SYS values
5. **qsys-component**: Component selector/browser

**Example Flow**:
```
[inject] → [qsys-set: Gain 1, gain, -10] → [debug]
[qsys-in: Gain 1, gain] → [function: format] → [dashboard]
```

---

### Phase 4: Modular WebUI

**Directory**: `Server/webui/`

**Stack**:
- **Framework**: React or Vue.js
- **State**: Redux/Vuex or Zustand
- **WebSocket**: Socket.io-client or native WebSocket
- **UI Components**: Material-UI, Tailwind, or custom
- **Build**: Vite or Webpack

**Features**:
- Component browser (discover Q-SYS components)
- Dynamic control panels
- Real-time value updates
- Drag-and-drop UI builder
- Presets/scenes
- User permissions

**Component Examples**:
```jsx
// Gain Control Component
<GainControl 
  component="Gain 1"
  control="gain"
  min={-100}
  max={20}
/>

// Mixer Channel Strip
<MixerChannel
  component="Mixer 1"
  channel={1}
  controls={['gain', 'mute', 'solo']}
/>

// Dynamic Component Loader
<QSYSComponent
  component="Gain 1"
  autoDiscover={true}
/>
```

---

### Phase 5: Cross-Platform Kiosk Apps

#### Desktop (Electron)
**Directory**: `Apps/electron/`

**Features**:
- Load Node.js WebUI in Electron window
- Fullscreen kiosk mode
- Auto-start on boot
- Crash recovery/auto-restart
- Local config (Q-SYS server IP)

**Packaging**:
- Windows: `.exe` installer (Inno Setup)
- macOS: `.dmg` bundle
- Linux: `.deb`, `.rpm`, AppImage

#### Mobile (React Native + Capacitor)
**Directory**: `Apps/mobile/`

**Features**:
- Load WebUI in WebView
- Touch-optimized controls
- Landscape/portrait support
- Splash screen
- Push notifications (optional)

**Packaging**:
- Android: `.apk` / Google Play
- iOS: `.ipa` / App Store

---

## Message Protocol Specification

### Command Types

| Type | Description | Direction |
|------|-------------|-----------|
| `get` | Read value from Q-SYS | Client → Q-SYS |
| `set` | Write value to Q-SYS | Client → Q-SYS |
| `subscribe` | Subscribe to value changes | Client → Q-SYS |
| `unsubscribe` | Unsubscribe from changes | Client → Q-SYS |
| `list` | List all components | Client → Q-SYS |
| `discover` | Discover component controls | Client → Q-SYS |
| `update` | Value changed notification | Q-SYS → Client |
| `error` | Error response | Q-SYS → Client |

### Example Messages

#### Subscribe to Value Changes
```json
{
  "id": 10,
  "type": "subscribe",
  "component": "Gain 1",
  "control": "gain"
}
```

#### Update Notification
```json
{
  "type": "update",
  "component": "Gain 1",
  "control": "gain",
  "value": -12.5,
  "timestamp": 1710194820
}
```

---

## Security Considerations

1. **Authentication**:
   - JWT tokens for API access
   - WebSocket authentication handshake
   - Q-SYS plugin password protection

2. **Authorization**:
   - Role-based access control (admin, operator, viewer)
   - Component-level permissions
   - Read-only vs read-write access

3. **Transport Security**:
   - Use `wss://` (WebSocket Secure) for production
   - TLS certificates
   - HTTPS for REST API

4. **Q-SYS Protection**:
   - Rate limiting
   - Input validation
   - Whitelist allowed components

---

## Development Roadmap

### Milestone 1: Core Bridge (Weeks 1-2)
- [x] Project structure
- [ ] Q-SYS plugin with WebSocket client
- [ ] Component access (get/set)
- [ ] Basic Node.js server
- [ ] WebSocket communication
- [ ] Testing with Q-SYS Designer

### Milestone 2: Node.js Server (Weeks 3-4)
- [ ] Full REST API
- [ ] State management
- [ ] Authentication/sessions
- [ ] Multi-client support
- [ ] WebSocket server for clients

### Milestone 3: WebUI (Weeks 5-6)
- [ ] React/Vue app structure
- [ ] Component discovery UI
- [ ] Real-time controls
- [ ] Dynamic component loader
- [ ] Responsive design

### Milestone 4: Node-RED (Week 7)
- [ ] Custom Node-RED nodes
- [ ] Node-RED integration guide
- [ ] Example flows

### Milestone 5: Kiosk Apps (Weeks 8-10)
- [ ] Electron app (Windows, macOS, Linux)
- [ ] React Native/Capacitor mobile app
- [ ] Packaging/distribution
- [ ] Installation guides

---

## Testing Strategy

1. **Unit Tests**: Jest/Mocha for Node.js code
2. **Integration Tests**: Q-SYS plugin ↔ Node.js server
3. **E2E Tests**: Playwright/Cypress for WebUI
4. **Load Tests**: Simulate multiple clients
5. **Q-SYS Emulator**: Test without hardware

---

## Documentation

1. **API Reference**: Complete API docs (OpenAPI/Swagger)
2. **Plugin Guide**: Q-SYS plugin installation/config
3. **Server Setup**: Node.js server deployment
4. **WebUI Guide**: Using the web interface
5. **Node-RED Guide**: Creating flows
6. **Kiosk Setup**: Installing/configuring kiosk apps
7. **Troubleshooting**: Common issues and solutions

---

## Success Metrics

- ✅ Reliable WebSocket connection (99.9% uptime)
- ✅ Low latency (< 50ms round-trip Q-SYS → Client)
- ✅ Support 50+ simultaneous clients
- ✅ Component discovery working
- ✅ Real-time value updates < 100ms
- ✅ Cross-platform apps working on all targets
- ✅ Node-RED nodes stable and documented

---

**Last Updated**: 2026-03-11  
**Status**: 🚧 Architecture defined, ready to build
