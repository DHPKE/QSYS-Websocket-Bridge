const WebSocket = require('ws');
const http = require('http');

// Configuration
const CONFIG = {
  port: 3000,
  qsysPath: '/qsys',
  clientPath: '/client',
  pingInterval: 30000,
  debug: true
};

// State
let qsysClient = null;
const webClients = new Set();
let stats = {
  messagesSent: 0,
  messagesReceived: 0,
  errors: 0
};

// Logging
function log(level, message, data = null) {
  if (!CONFIG.debug && level === 'debug') return;
  
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  console.log(logMessage);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>Q-SYS WebSocket Bridge</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #4287f5; }
    .status { padding: 15px; margin: 15px 0; border-radius: 4px; }
    .status.connected { background: #d4edda; color: #155724; }
    .status.disconnected { background: #f8d7da; color: #721c24; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
    .stat { background: #e9ecef; padding: 15px; border-radius: 4px; text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; color: #4287f5; }
    .stat-label { font-size: 12px; color: #6c757d; margin-top: 5px; }
    pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔌 Q-SYS WebSocket Bridge</h1>
    
    <div class="status ${qsysClient ? 'connected' : 'disconnected'}">
      <strong>Q-SYS Status:</strong> ${qsysClient ? '✅ Connected' : '❌ Disconnected'}
    </div>
    
    <div class="stats">
      <div class="stat">
        <div class="stat-value">${stats.messagesSent}</div>
        <div class="stat-label">Messages Sent</div>
      </div>
      <div class="stat">
        <div class="stat-value">${stats.messagesReceived}</div>
        <div class="stat-label">Messages Received</div>
      </div>
      <div class="stat">
        <div class="stat-value">${stats.errors}</div>
        <div class="stat-label">Errors</div>
      </div>
    </div>
    
    <h2>WebSocket Endpoints</h2>
    <pre>Q-SYS Plugin:  ws://localhost:${CONFIG.port}${CONFIG.qsysPath}
Web Clients:   ws://localhost:${CONFIG.port}${CONFIG.clientPath}</pre>
    
    <h2>Example Usage</h2>
    <pre>// Connect from browser
const ws = new WebSocket('ws://localhost:${CONFIG.port}${CONFIG.clientPath}');

// Get value
ws.send(JSON.stringify({
  id: 1,
  type: 'get',
  component: 'Gain 1',
  control: 'gain'
}));

// Set value
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
}));</pre>
  </div>
</body>
</html>
    `);
  } else if (req.url === '/stats') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      qsysConnected: !!qsysClient,
      webClients: webClients.size,
      stats
    }, null, 2));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// WebSocket server for Q-SYS
const wssQSYS = new WebSocket.Server({ 
  server,
  path: CONFIG.qsysPath
});

// WebSocket server for web clients
const wssClients = new WebSocket.Server({ 
  server,
  path: CONFIG.clientPath
});

// Handle Q-SYS connection
wssQSYS.on('connection', (ws) => {
  log('info', '🔌 Q-SYS plugin connected');
  
  if (qsysClient) {
    log('warn', 'Replacing existing Q-SYS connection');
    qsysClient.close();
  }
  
  qsysClient = ws;
  
  // Ping interval
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, CONFIG.pingInterval);
  
  ws.on('message', (data) => {
    stats.messagesReceived++;
    
    try {
      const message = JSON.parse(data);
      log('debug', '📨 Received from Q-SYS:', message);
      
      // Broadcast updates to all web clients
      if (message.type === 'update') {
        broadcastToClients(message);
      }
      
      // Route responses to requesting client (store request->client mapping)
      // For now, broadcast all responses
      broadcastToClients(message);
      
    } catch (err) {
      stats.errors++;
      log('error', 'Failed to parse message from Q-SYS:', err.message);
    }
  });
  
  ws.on('close', () => {
    log('info', '❌ Q-SYS plugin disconnected');
    clearInterval(pingInterval);
    qsysClient = null;
  });
  
  ws.on('error', (err) => {
    stats.errors++;
    log('error', 'Q-SYS connection error:', err.message);
  });
});

// Handle web client connections
wssClients.on('connection', (ws) => {
  log('info', '🌐 Web client connected');
  webClients.add(ws);
  
  // Send connection status
  ws.send(JSON.stringify({
    type: 'status',
    qsysConnected: !!qsysClient,
    timestamp: Date.now()
  }));
  
  ws.on('message', (data) => {
    stats.messagesReceived++;
    
    try {
      const message = JSON.parse(data);
      log('debug', '📨 Received from web client:', message);
      
      // Forward to Q-SYS
      if (qsysClient && qsysClient.readyState === WebSocket.OPEN) {
        qsysClient.send(JSON.stringify(message));
        stats.messagesSent++;
      } else {
        ws.send(JSON.stringify({
          id: message.id,
          type: 'response',
          status: 'error',
          error: 'Q-SYS not connected'
        }));
        stats.errors++;
      }
      
    } catch (err) {
      stats.errors++;
      log('error', 'Failed to parse message from client:', err.message);
    }
  });
  
  ws.on('close', () => {
    log('info', '❌ Web client disconnected');
    webClients.delete(ws);
  });
  
  ws.on('error', (err) => {
    stats.errors++;
    log('error', 'Web client error:', err.message);
  });
});

// Broadcast message to all web clients
function broadcastToClients(message) {
  const data = JSON.stringify(message);
  let sent = 0;
  
  webClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
      sent++;
      stats.messagesSent++;
    }
  });
  
  if (sent > 0) {
    log('debug', `📤 Broadcast to ${sent} clients`);
  }
}

// Start server
server.listen(CONFIG.port, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Q-SYS WebSocket Bridge Server');
  console.log('='.repeat(60));
  console.log(`\n📡 Server running on http://localhost:${CONFIG.port}`);
  console.log(`\n🔌 WebSocket Endpoints:`);
  console.log(`   Q-SYS Plugin:  ws://localhost:${CONFIG.port}${CONFIG.qsysPath}`);
  console.log(`   Web Clients:   ws://localhost:${CONFIG.port}${CONFIG.clientPath}`);
  console.log(`\n📊 Stats:          http://localhost:${CONFIG.port}/stats`);
  console.log(`\n⚙️  Debug Level:    ${CONFIG.debug ? 'ON' : 'OFF'}`);
  console.log('\n' + '='.repeat(60) + '\n');
  
  log('info', 'Server started successfully');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log('info', 'SIGTERM received, closing server...');
  server.close(() => {
    log('info', 'Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  log('info', 'SIGINT received, closing server...');
  server.close(() => {
    log('info', 'Server closed');
    process.exit(0);
  });
});
