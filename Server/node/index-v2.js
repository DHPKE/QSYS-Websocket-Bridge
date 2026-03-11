const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./src/config');
const database = require('./src/database');
const state = require('./src/state');
const authRoutes = require('./src/routes/auth');
const qsysRoutes = require('./src/routes/qsys');

// Initialize database
database.initialize();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origins }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', qsysRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    qsysConnected: !!qsysClient,
    webClients: webClients.size,
    uptime: process.uptime()
  });
});

// Home page
app.get('/', (req, res) => {
  const stats = state.getStats();
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Q-SYS WebSocket Bridge v2</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #4287f5; }
    .status { padding: 15px; margin: 15px 0; border-radius: 4px; }
    .status.connected { background: #d4edda; color: #155724; }
    .status.disconnected { background: #f8d7da; color: #721c24; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
    .stat { background: #e9ecef; padding: 15px; border-radius: 4px; text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; color: #4287f5; }
    .stat-label { font-size: 12px; color: #6c757d; margin-top: 5px; }
    .section { margin: 30px 0; }
    .endpoint { background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 4px; font-family: monospace; }
    pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }
    .badge { background: #4287f5; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔌 Q-SYS WebSocket Bridge <span class="badge">v2.0</span></h1>
    
    <div class="status ${qsysClient ? 'connected' : 'disconnected'}">
      <strong>Q-SYS Status:</strong> ${qsysClient ? '✅ Connected' : '❌ Disconnected'}
    </div>
    
    <div class="stats">
      <div class="stat">
        <div class="stat-value">${stats.components}</div>
        <div class="stat-label">Components</div>
      </div>
      <div class="stat">
        <div class="stat-value">${stats.cacheSize}</div>
        <div class="stat-label">Cached Controls</div>
      </div>
      <div class="stat">
        <div class="stat-value">${stats.subscriptions}</div>
        <div class="stat-label">Subscriptions</div>
      </div>
      <div class="stat">
        <div class="stat-value">${webClients.size}</div>
        <div class="stat-label">Web Clients</div>
      </div>
    </div>
    
    <div class="section">
      <h2>🔌 WebSocket Endpoints</h2>
      <div class="endpoint">Q-SYS Plugin: ws://${config.server.host}:${config.server.port}${config.websocket.qsysPath}</div>
      <div class="endpoint">Web Clients: ws://${config.server.host}:${config.server.port}${config.websocket.clientPath}</div>
    </div>
    
    <div class="section">
      <h2>🌐 REST API Endpoints</h2>
      <div class="endpoint">POST /api/auth/login - Login and get JWT token</div>
      <div class="endpoint">POST /api/auth/register - Register new user</div>
      <div class="endpoint">GET /api/components - List all components</div>
      <div class="endpoint">GET /api/component/:name - Get component details</div>
      <div class="endpoint">GET /api/component/:name/:control - Get control value</div>
      <div class="endpoint">GET /api/component/:name/:control/history - Get value history</div>
      <div class="endpoint">GET /api/subscriptions - List active subscriptions</div>
      <div class="endpoint">GET /api/stats - Get statistics</div>
      <div class="endpoint">GET /health - Health check</div>
    </div>
    
    <div class="section">
      <h2>🔐 Authentication</h2>
      <p>All API endpoints (except /auth/*) require authentication via:</p>
      <ul>
        <li><strong>JWT Token:</strong> Authorization: Bearer &lt;token&gt;</li>
        <li><strong>API Key:</strong> X-API-Key: &lt;key&gt;</li>
      </ul>
      <pre>// Login example
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin' })
})
.then(r => r.json())
.then(data => {
  localStorage.setItem('token', data.token);
  console.log('Logged in!', data.user);
});</pre>
    </div>
    
    <div class="section">
      <h2>📊 Statistics</h2>
      <pre>${JSON.stringify(stats, null, 2)}</pre>
    </div>
  </div>
</body>
</html>
  `);
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket state
let qsysClient = null;
const webClients = new Set();

// WebSocket server for Q-SYS
const wssQSYS = new WebSocket.Server({ 
  server,
  path: config.websocket.qsysPath
});

// WebSocket server for web clients
const wssClients = new WebSocket.Server({ 
  server,
  path: config.websocket.clientPath
});

// Logging
function log(level, message, data = null) {
  if (!config.server.debug && level === 'debug') return;
  
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
}

// Handle Q-SYS connection
wssQSYS.on('connection', (ws) => {
  log('info', '🔌 Q-SYS plugin connected');
  
  if (qsysClient) {
    log('warn', 'Replacing existing Q-SYS connection');
    qsysClient.close();
  }
  
  qsysClient = ws;
  
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, config.websocket.pingInterval);
  
  ws.on('message', (data) => {
    state.incrementStat('messagesReceived');
    
    try {
      const message = JSON.parse(data);
      log('debug', '📨 From Q-SYS:', message);
      
      // Update cache
      if (message.type === 'response' && message.status === 'ok' && message.value !== undefined) {
        // This is a response to a get request - cache it
        // We need to track which component/control this response is for
      }
      
      // Handle updates
      if (message.type === 'update') {
        state.updateCache(message.component, message.control, message.value);
        broadcastToSubscribers(message);
      }
      
      // Broadcast all messages to web clients
      broadcastToClients(message);
      
    } catch (err) {
      state.incrementStat('errors');
      log('error', 'Failed to parse Q-SYS message:', err.message);
    }
  });
  
  ws.on('close', () => {
    log('info', '❌ Q-SYS plugin disconnected');
    clearInterval(pingInterval);
    qsysClient = null;
  });
  
  ws.on('error', (err) => {
    state.incrementStat('errors');
    log('error', 'Q-SYS connection error:', err.message);
  });
});

// Handle web client connections
wssClients.on('connection', (ws) => {
  log('info', '🌐 Web client connected');
  webClients.add(ws);
  
  // Send status
  ws.send(JSON.stringify({
    type: 'status',
    qsysConnected: !!qsysClient,
    timestamp: Date.now()
  }));
  
  ws.on('message', (data) => {
    state.incrementStat('messagesReceived');
    
    try {
      const message = JSON.parse(data);
      log('debug', '📨 From web client:', message);
      
      // Handle subscribe requests
      if (message.type === 'subscribe') {
        const subId = state.subscribe(message.component, message.control, ws);
        log('info', `Subscribed client to ${message.component}.${message.control} (${subId})`);
      }
      
      // Handle unsubscribe requests
      if (message.type === 'unsubscribe') {
        state.unsubscribe(message.component, message.control, ws);
        log('info', `Unsubscribed client from ${message.component}.${message.control}`);
      }
      
      // Forward to Q-SYS
      if (qsysClient && qsysClient.readyState === WebSocket.OPEN) {
        qsysClient.send(JSON.stringify(message));
        state.incrementStat('messagesSent');
      } else {
        ws.send(JSON.stringify({
          id: message.id,
          type: 'response',
          status: 'error',
          error: 'Q-SYS not connected'
        }));
        state.incrementStat('errors');
      }
      
    } catch (err) {
      state.incrementStat('errors');
      log('error', 'Failed to parse client message:', err.message);
    }
  });
  
  ws.on('close', () => {
    log('info', '❌ Web client disconnected');
    webClients.delete(ws);
    state.unsubscribeClient(ws);
  });
  
  ws.on('error', (err) => {
    state.incrementStat('errors');
    log('error', 'Web client error:', err.message);
  });
});

// Broadcast to all web clients
function broadcastToClients(message) {
  const data = JSON.stringify(message);
  let sent = 0;
  
  webClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
      sent++;
      state.incrementStat('messagesSent');
    }
  });
  
  if (sent > 0) {
    log('debug', `📤 Broadcast to ${sent} clients`);
  }
}

// Broadcast only to subscribers
function broadcastToSubscribers(message) {
  const subscribers = state.getSubscribers(message.component, message.control);
  const data = JSON.stringify(message);
  let sent = 0;
  
  subscribers.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
      sent++;
      state.incrementStat('messagesSent');
    }
  });
  
  if (sent > 0) {
    log('debug', `📤 Update sent to ${sent} subscribers`);
  }
}

// Start server
server.listen(config.server.port, config.server.host, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 Q-SYS WebSocket Bridge Server v2.0');
  console.log('='.repeat(70));
  console.log(`\n📡 HTTP Server:     http://${config.server.host}:${config.server.port}`);
  console.log(`\n🔌 WebSocket Endpoints:`);
  console.log(`   Q-SYS Plugin:    ws://${config.server.host}:${config.server.port}${config.websocket.qsysPath}`);
  console.log(`   Web Clients:     ws://${config.server.host}:${config.server.port}${config.websocket.clientPath}`);
  console.log(`\n🌐 REST API:        http://${config.server.host}:${config.server.port}/api`);
  console.log(`\n📊 Health Check:    http://${config.server.host}:${config.server.port}/health`);
  console.log(`\n⚙️  Debug Mode:      ${config.server.debug ? 'ON' : 'OFF'}`);
  console.log(`\n🔐 Authentication:  JWT + API Keys`);
  console.log('\n' + '='.repeat(70) + '\n');
  
  log('info', 'Server started successfully');
});

// Graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
  log('info', 'Shutting down...');
  
  database.close();
  
  server.close(() => {
    log('info', 'Server closed');
    process.exit(0);
  });
}
