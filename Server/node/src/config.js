require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    debug: process.env.DEBUG === 'true'
  },
  websocket: {
    qsysPath: process.env.QSYS_PATH || '/qsys',
    clientPath: process.env.CLIENT_PATH || '/client',
    pingInterval: parseInt(process.env.PING_INTERVAL) || 30000
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiry: process.env.JWT_EXPIRY || '24h'
  },
  rateLimit: {
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100
  },
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',')
  },
  database: {
    path: process.env.DB_PATH || './data/bridge.db'
  }
};
