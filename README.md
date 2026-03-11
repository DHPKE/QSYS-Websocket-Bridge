# Q-SYS WebSocket Bridge

Universal WebSocket bridge plugin for Q-SYS Designer - enables bidirectional real-time communication between Q-SYS and external systems.

## Purpose

Provide a flexible, production-ready WebSocket client for Q-SYS that can:
- Connect to external WebSocket servers (ws:// and wss://)
- Send and receive JSON or binary data
- Map WebSocket messages to Q-SYS controls
- Support authentication (headers, tokens)
- Auto-reconnect on disconnect
- Keep-alive with ping/pong
- Debug logging and status monitoring

## Use Cases

- **Home Automation**: Control Q-SYS from Home Assistant, Node-RED, etc.
- **Third-Party APIs**: Integrate with real-time APIs (weather, stocks, IoT)
- **Custom Dashboards**: Build web interfaces that control Q-SYS
- **Distributed Systems**: Connect multiple Q-SYS cores
- **Data Streaming**: Real-time telemetry, sensor data, analytics

## Project Status

✅ **Phase 2 Complete** - REST API + Authentication  
✅ **Phase 3 Complete** - Vue 3 WebUI  
🚧 **Phase 4 In Progress** - Mobile apps + advanced features

## Repository Structure

```
QSYS-Websocket-Bridge/
├── Plugin/              # Q-SYS plugin (.qplug file)
├── Server/              # Server implementations
│   ├── node/           # Node.js server (Phase 2 + 3)
│   │   ├── index-v2.js # REST API + WebSocket server
│   │   ├── client/     # Vue 3 WebUI (Phase 3)
│   │   └── src/        # Backend modules
│   ├── node-red/       # Node-RED flows
│   └── python/         # Python example server
├── Docs/               # Documentation
├── Examples/           # Usage examples and templates
└── Tests/              # Test scripts
```

## Features

### ✅ Completed (Phase 2 + 3)

- [x] REST API server (Express)
- [x] JWT authentication
- [x] User management (SQLite)
- [x] Role-based access control
- [x] Component state caching
- [x] Value history tracking
- [x] **Vue 3 WebUI** with Vueform
- [x] Real-time WebSocket dashboard
- [x] Component control interface
- [x] Responsive dark theme

### 🚧 Planned (Phase 4+)

- [ ] Core WebSocket client plugin
- [ ] Secure (wss://) and insecure (ws://) support
- [ ] JSON message parsing
- [ ] Binary data support
- [ ] Authentication headers
- [ ] Auto-reconnect with backoff
- [ ] Ping/pong keep-alive
- [ ] Status indicators (connected, error, data rate)
- [ ] Debug levels (None, Errors, All)
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced control types (sliders, charts)

## Quick Start

### Backend (Phase 2)

```bash
cd Server/node
npm install
cp .env.example .env
# Edit .env and set JWT_SECRET
node index-v2.js
```

Server runs on: **http://localhost:3000**

### WebUI (Phase 3)

```bash
cd Server/node/client
npm install
npm run dev
```

WebUI runs on: **http://localhost:5173**

**Default credentials:**
- Username: `admin`
- Password: `admin`

### Full Documentation

- [Phase 2: REST API + Auth](Server/node/PHASE2_README.md)
- [Phase 3: Vue 3 WebUI](Server/node/PHASE3_README.md)

## Requirements

- Q-SYS Designer 9.0 or later
- WebSocket server (external)

## License

MIT License - See [LICENSE](LICENSE) file

## Author

**DHPKE**

---

**Note**: This project uses the Q-SYS WebSocket API. See [Q-SYS WebSocket Documentation](https://q-syshelp.qsc.com/Content/Control_Scripting/Using_Lua_in_Q-Sys/lua_web_socket.htm) for API reference.
