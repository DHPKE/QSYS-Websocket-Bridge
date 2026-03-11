# Q-SYS WebSocket Bridge - Quick Start

## Prerequisites

- **Q-SYS Designer** 9.0 or later
- **Node.js** 18+ installed
- Basic understanding of Q-SYS and WebSocket

---

## Step 1: Start Node.js Server

```bash
cd Server/node
npm install
npm start
```

Server will start on `http://localhost:3000`

**Endpoints:**
- Q-SYS Plugin: `ws://localhost:3000/qsys`
- Web Clients: `ws://localhost:3000/client`
- Web UI: `http://localhost:3000`
- Stats API: `http://localhost:3000/stats`

---

## Step 2: Install Q-SYS Plugin

1. Open Q-SYS Designer
2. Drag **User Component Plugin** onto canvas
3. Browse to `Plugin/QSYS-Websocket-Bridge.qplug`
4. Plugin will appear as **"WebSocket Bridge v1.0"**

---

## Step 3: Configure Plugin

1. Double-click plugin to open properties
2. Go to **Config** page
3. Set connection details:
   - **Server Host**: `localhost` (or server IP)
   - **Server Port**: `3000`
   - **Server URL**: `/qsys`
   - **Use SSL**: Off (for testing)
   - **Debug Level**: `Errors` or `All`

4. Click **Connect** button
5. Status should show: ✅ **Connected**

---

## Step 4: Test Communication

### From Browser Console

Open `http://localhost:3000` and open browser DevTools console:

```javascript
// Connect to bridge
const ws = new WebSocket('ws://localhost:3000/client');

ws.onopen = () => console.log('Connected!');
ws.onmessage = (e) => console.log('Received:', JSON.parse(e.data));

// Get a value (replace "Gain 1" with actual component name)
ws.send(JSON.stringify({
  id: 1,
  type: 'get',
  component: 'Gain 1',
  control: 'gain'
}));

// Set a value
ws.send(JSON.stringify({
  id: 2,
  type: 'set',
  component: 'Gain 1',
  control: 'gain',
  value: -10
}));

// Subscribe to changes
ws.send(JSON.stringify({
  id: 3,
  type: 'subscribe',
  component: 'Gain 1',
  control: 'gain'
}));
```

### From Q-SYS Designer

1. Add a **Gain** component to your design
2. Name it `Gain 1`
3. In browser console, send get/set/subscribe commands
4. Change the gain in Designer → see updates in console!

---

## Message Protocol

### Request: Get Value

```json
{
  "id": 1,
  "type": "get",
  "component": "Gain 1",
  "control": "gain"
}
```

**Response:**

```json
{
  "id": 1,
  "type": "response",
  "status": "ok",
  "value": -10.5
}
```

### Request: Set Value

```json
{
  "id": 2,
  "type": "set",
  "component": "Gain 1",
  "control": "gain",
  "value": -15.0
}
```

**Response:**

```json
{
  "id": 2,
  "type": "response",
  "status": "ok"
}
```

### Request: Subscribe

```json
{
  "id": 3,
  "type": "subscribe",
  "component": "Gain 1",
  "control": "gain"
}
```

**Response:**

```json
{
  "id": 3,
  "type": "response",
  "status": "ok"
}
```

**Update Notifications:**

```json
{
  "type": "update",
  "subscription": 3,
  "component": "Gain 1",
  "control": "gain",
  "value": -12.5,
  "timestamp": 1710195000
}
```

### Request: Unsubscribe

```json
{
  "id": 4,
  "type": "unsubscribe",
  "component": "Gain 1",
  "control": "gain"
}
```

### Request: List Components

```json
{
  "id": 5,
  "type": "list"
}
```

**Response:**

```json
{
  "id": 5,
  "type": "response",
  "status": "ok",
  "components": [
    { "name": "Gain 1" },
    { "name": "Mixer 1" }
  ]
}
```

---

## Architecture

```
┌─────────────────┐
│  Q-SYS Designer │
│   (Plugin)      │
└────────┬────────┘
         │ WebSocket
         │ ws://localhost:3000/qsys
         ↓
┌─────────────────┐
│  Node.js Server │
│  (Bridge)       │
└────────┬────────┘
         │ WebSocket
         │ ws://localhost:3000/client
         ↓
┌─────────────────┐
│  Web Clients    │
│  (Browser, etc) │
└─────────────────┘
```

---

## Features

✅ **Direct Component Access** - No Named Controls required!  
✅ **Get/Set Values** - Read and write any control  
✅ **Subscribe to Changes** - Real-time updates  
✅ **Auto-Reconnect** - Handles disconnects gracefully  
✅ **Multi-Client** - Multiple web clients can connect  
✅ **Statistics** - Message counts, errors  
✅ **Debug Logging** - Adjustable debug levels  

---

## Troubleshooting

### Plugin won't connect

- Check server is running (`npm start`)
- Verify host/port settings match server
- Check firewall settings
- Look at plugin **Status_Text** control for errors

### Can't find component

- Component name must match exactly (case-sensitive)
- Component must exist in Q-SYS design
- Check plugin debug output in Designer

### No updates received

- Verify subscription was successful
- Change the control in Designer
- Check web client connection status
- Look at server console for errors

### Server crashes

- Check Node.js version (18+ required)
- Look at error logs
- Try `npm install` again

---

## Next Steps

1. **Build Web UI** - Create React/Vue interface
2. **Add Authentication** - JWT tokens for security
3. **Node-RED Integration** - Custom nodes
4. **REST API** - HTTP endpoints
5. **Kiosk Apps** - Electron/React Native

---

## Support

- **Issues**: https://github.com/DHPKE/QSYS-Websocket-Bridge/issues
- **Docs**: `/Docs` folder
- **Examples**: `/Examples` folder

---

**Last Updated**: 2026-03-11  
**Version**: 1.0.0
