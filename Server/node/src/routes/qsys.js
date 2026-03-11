const express = require('express');
const state = require('../state');
const { authenticate, requireRole } = require('../auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/components - List all components
router.get('/components', (req, res) => {
  const components = state.getAllComponents();
  res.json({ components });
});

// GET /api/component/:name - Get component details
router.get('/component/:name', (req, res) => {
  const { name } = req.params;
  const component = state.getComponent(name);
  
  if (!component) {
    return res.status(404).json({ error: 'Component not found in cache' });
  }
  
  res.json(component);
});

// GET /api/component/:name/:control - Get control value
router.get('/component/:name/:control', (req, res) => {
  const { name, control } = req.params;
  const cached = state.getFromCache(name, control);
  
  if (!cached) {
    return res.status(404).json({ error: 'Control not found in cache' });
  }
  
  res.json({
    component: name,
    control,
    value: cached.value,
    timestamp: cached.timestamp
  });
});

// POST /api/component/:name/:control - Set control value
router.post('/component/:name/:control', requireRole('admin', 'operator'), (req, res) => {
  const { name, control } = req.params;
  const { value } = req.body;
  
  if (value === undefined) {
    return res.status(400).json({ error: 'Value required' });
  }
  
  // This would need to send to Q-SYS via WebSocket
  // For now, return error indicating this endpoint needs WebSocket connection
  res.status(501).json({ 
    error: 'Use WebSocket for real-time set operations',
    hint: 'POST values via WebSocket client endpoint'
  });
});

// GET /api/component/:name/:control/history - Get value history
router.get('/component/:name/:control/history', (req, res) => {
  const { name, control } = req.params;
  const limit = parseInt(req.query.limit) || 100;
  
  const history = state.getHistory(name, control, limit);
  
  res.json({
    component: name,
    control,
    history
  });
});

// GET /api/subscriptions - List all subscriptions
router.get('/subscriptions', (req, res) => {
  const subscriptions = state.getAllSubscriptions();
  res.json({ subscriptions });
});

// GET /api/stats - Get state statistics
router.get('/stats', (req, res) => {
  const stats = state.getStats();
  res.json(stats);
});

module.exports = router;
