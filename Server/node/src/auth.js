const jwt = require('jsonwebtoken');
const config = require('./config');
const database = require('./database');

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiry }
  );
}

// Middleware: Verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
}

// Middleware: Verify API key
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  const keyRecord = database.getApiKey(apiKey);
  
  if (!keyRecord) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  
  // Update last used
  database.updateApiKeyUsage(apiKey);
  
  // Get user
  const user = database.getUserById(keyRecord.user_id);
  req.user = {
    id: user.id,
    username: user.username,
    role: user.role,
    apiKey: true
  };
  
  next();
}

// Middleware: Either JWT or API key
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const apiKey = req.headers['x-api-key'];
  
  if (authHeader) {
    return authenticateToken(req, res, next);
  } else if (apiKey) {
    return authenticateApiKey(req, res, next);
  } else {
    return res.status(401).json({ error: 'Authentication required' });
  }
}

// Middleware: Require specific role
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = {
  generateToken,
  authenticateToken,
  authenticateApiKey,
  authenticate,
  requireRole
};
