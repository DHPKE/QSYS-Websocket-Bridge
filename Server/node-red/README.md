# node-red-contrib-qsys-bridge

Node-RED nodes for Q-SYS WebSocket Bridge - Control Q-SYS components without Named Controls!

## Installation

### Option 1: NPM (when published)

```bash
npm install node-red-contrib-qsys-bridge
```

### Option 2: Local Installation (for development)

```bash
cd ~/.node-red
npm install /path/to/QSYS-Websocket-Bridge/Server/node-red
```

Restart Node-RED after installation.

## Prerequisites

1. **Q-SYS WebSocket Bridge Server** must be running
2. **Q-SYS Plugin** must be installed and connected
3. **Node-RED** 2.0 or later

## Nodes

### 🔌 qsys-config

Configuration node that manages WebSocket connection to the Q-SYS Bridge server.

**Properties:**
- **Host**: Bridge server hostname/IP (default: `localhost`)
- **Port**: Bridge server port (default: `3000`)
- **Path**: WebSocket endpoint (default: `/client`)

### 📥 qsys-get

Get a control value from Q-SYS component.

**Inputs:**
- `msg.component` (optional): Component name
- `msg.control` (optional): Control name

**Outputs:**
- `msg.payload`: Control value (number, string, or boolean)
- `msg.component`: Component name
- `msg.control`: Control name
- `msg.qsys`: Full Q-SYS response

**Example:**
```javascript
msg.component = "Gain 1";
msg.control = "gain";
return msg;
// Output: msg.payload = -10.5
```

### 📤 qsys-set

Set a control value on Q-SYS component.

**Inputs:**
- `msg.payload`: Value to set (number, string, or boolean)
- `msg.component` (optional): Component name
- `msg.control` (optional): Control name

**Outputs:**
- `msg.component`: Component name
- `msg.control`: Control name
- `msg.value`: Value that was set
- `msg.qsys`: Full Q-SYS response

**Example:**
```javascript
msg.component = "Gain 1";
msg.control = "gain";
msg.payload = -15;
return msg;
```

### 📡 qsys-subscribe

Subscribe to real-time control value changes from Q-SYS.

**Inputs:**
- `msg.component` (optional): Change subscription to this component
- `msg.control` (optional): Change subscription to this control

**Outputs:**
- `msg.payload`: New control value
- `msg.component`: Component name
- `msg.control`: Control name
- `msg.timestamp`: Unix timestamp of the change
- `msg.qsys`: Full Q-SYS update message

**Features:**
- Automatically subscribes on deploy
- Maintains subscription after reconnection
- Outputs message whenever value changes in Q-SYS

**Example:**
```
[qsys-subscribe: Gain 1.gain] → [function] → [dashboard]
```

### 📋 qsys-list

List all Q-SYS components that have been accessed.

**Inputs:**
Trigger with any message.

**Outputs:**
- `msg.payload`: Array of component objects
- `msg.qsys`: Full Q-SYS response

**Example Output:**
```javascript
msg.payload = [
  { "name": "Gain 1" },
  { "name": "Mixer 1" }
]
```

## Example Flows

### Simple Gain Control

```
[inject] → [qsys-set: Gain 1, gain, -10] → [debug]
```

### Real-Time Monitoring

```
[qsys-subscribe: Gain 1, gain] → [debug]
```

### Threshold Trigger

```
[qsys-subscribe: Gain 1, gain]
    ↓
[function: if (msg.payload < -20) return msg;]
    ↓
[qsys-set: LED 1, state, true]
```

### Dynamic Control

```
[inject: {"component": "Gain 1", "control": "gain"}]
    ↓
[qsys-get]
    ↓
[function: msg.payload = msg.payload - 3; return msg;]
    ↓
[qsys-set]
```

### Component Discovery

```
[inject] → [qsys-list] → [debug]
```

## Status Indicators

All nodes show connection status:

- 🟢 **Green dot**: Connected and ready
- 🟡 **Yellow ring**: Not subscribed (qsys-subscribe only)
- 🔴 **Red ring**: Disconnected
- 🔴 **Red dot**: Error

## Configuration Example

### 1. Add qsys-config Node

1. Drag any Q-SYS node onto canvas
2. Double-click to edit
3. Click pencil icon next to "Bridge"
4. Configure:
   - **Host**: `localhost` (or your bridge server IP)
   - **Port**: `3000`
   - **Path**: `/client`
5. Click "Add"

### 2. Use Q-SYS Nodes

Now all Q-SYS nodes can share this configuration!

## Architecture

```
┌─────────────┐       ┌──────────────────┐       ┌──────────────┐
│  Q-SYS      │  ws   │  Bridge Server   │  ws   │  Node-RED    │
│  Plugin     │◄─────►│  (Node.js)       │◄─────►│  Nodes       │
└─────────────┘       └──────────────────┘       └──────────────┘
```

## No Named Controls Required!

Unlike traditional Q-SYS integrations, you don't need to wire Named Controls in Q-SYS Designer. Just specify the component and control names in your Node-RED flow!

## Troubleshooting

### Nodes show "disconnected"

- Check that bridge server is running (`npm start` in Server/node)
- Check that Q-SYS plugin is connected
- Verify host/port settings in qsys-config

### "Component not found" error

- Component name must match exactly (case-sensitive)
- Component must exist in Q-SYS design
- Try listing components first with qsys-list

### No updates received

- Verify subscription was successful (status shows "subscribed")
- Change the control in Q-SYS Designer
- Check bridge server console for errors

## Advanced Usage

### Multiple Bridge Connections

Create multiple qsys-config nodes to connect to different Q-SYS cores simultaneously!

### Error Handling

```javascript
// In function node after qsys-get or qsys-set
if (msg.qsys.status !== 'ok') {
  node.error("Q-SYS error: " + msg.qsys.error);
  return null;
}
return msg;
```

### Batch Operations

```javascript
// Set multiple controls
const controls = [
  { component: "Gain 1", control: "gain", value: -10 },
  { component: "Gain 2", control: "gain", value: -12 },
  { component: "Mute 1", control: "mute", value: true }
];

return controls.map(c => ({ payload: c }));
```

## License

MIT

## Repository

https://github.com/DHPKE/QSYS-Websocket-Bridge

## Support

- **Issues**: https://github.com/DHPKE/QSYS-Websocket-Bridge/issues
- **Documentation**: `/Docs` folder in repository
