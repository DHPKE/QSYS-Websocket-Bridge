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

🚧 **In Development** - Initial structure being created

## Repository Structure

```
QSYS-Websocket-Bridge/
├── Plugin/              # Q-SYS plugin (.qplug file)
├── Server/              # Example server implementations
│   ├── node/           # Node.js example server
│   └── python/         # Python example server
├── Docs/               # Documentation
├── Examples/           # Usage examples and templates
└── Tests/              # Test scripts
```

## Features (Planned)

- [ ] Core WebSocket client plugin
- [ ] Secure (wss://) and insecure (ws://) support
- [ ] JSON message parsing
- [ ] Binary data support
- [ ] Authentication headers
- [ ] Auto-reconnect with backoff
- [ ] Ping/pong keep-alive
- [ ] Status indicators (connected, error, data rate)
- [ ] Debug levels (None, Errors, All)
- [ ] Example Node.js server
- [ ] Example Python server
- [ ] Documentation and tutorials

## Quick Start

_(Coming soon)_

## Requirements

- Q-SYS Designer 9.0 or later
- WebSocket server (external)

## License

MIT License - See [LICENSE](LICENSE) file

## Author

**DHPKE**

---

**Note**: This project uses the Q-SYS WebSocket API. See [Q-SYS WebSocket Documentation](https://q-syshelp.qsc.com/Content/Control_Scripting/Using_Lua_in_Q-Sys/lua_web_socket.htm) for API reference.
