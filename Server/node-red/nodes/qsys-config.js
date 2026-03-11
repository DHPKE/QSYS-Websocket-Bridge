module.exports = function(RED) {
  const WebSocket = require('ws');
  
  function QSYSConfigNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    
    // Configuration
    node.host = config.host || 'localhost';
    node.port = config.port || 3000;
    node.path = config.path || '/client';
    node.reconnectTimeout = 5000;
    
    // State
    node.ws = null;
    node.connected = false;
    node.messageId = 0;
    node.pendingRequests = {};
    node.subscribers = [];
    
    // Get next message ID
    node.getMessageId = function() {
      return ++node.messageId;
    };
    
    // Connect to WebSocket bridge
    node.connect = function() {
      if (node.ws && node.ws.readyState === WebSocket.OPEN) {
        return;
      }
      
      const url = `ws://${node.host}:${node.port}${node.path}`;
      node.log(`Connecting to ${url}...`);
      
      try {
        node.ws = new WebSocket(url);
        
        node.ws.on('open', () => {
          node.connected = true;
          node.log('Connected to Q-SYS Bridge');
          node.emit('connected');
        });
        
        node.ws.on('message', (data) => {
          try {
            const msg = JSON.parse(data);
            
            // Handle responses
            if (msg.type === 'response' && msg.id && node.pendingRequests[msg.id]) {
              const callback = node.pendingRequests[msg.id];
              delete node.pendingRequests[msg.id];
              callback(null, msg);
            }
            
            // Handle updates (subscriptions)
            if (msg.type === 'update') {
              node.emit('update', msg);
            }
            
            // Broadcast all messages
            node.emit('message', msg);
            
          } catch (err) {
            node.error('Failed to parse message: ' + err.message);
          }
        });
        
        node.ws.on('close', () => {
          node.connected = false;
          node.log('Disconnected from Q-SYS Bridge');
          node.emit('disconnected');
          
          // Auto-reconnect
          setTimeout(() => {
            if (node.ws) {
              node.connect();
            }
          }, node.reconnectTimeout);
        });
        
        node.ws.on('error', (err) => {
          node.error('WebSocket error: ' + err.message);
          node.emit('error', err);
        });
        
      } catch (err) {
        node.error('Failed to connect: ' + err.message);
        setTimeout(() => {
          node.connect();
        }, node.reconnectTimeout);
      }
    };
    
    // Send request with callback
    node.request = function(message, callback) {
      if (!node.connected || !node.ws) {
        return callback(new Error('Not connected to Q-SYS Bridge'));
      }
      
      message.id = node.getMessageId();
      node.pendingRequests[message.id] = callback;
      
      try {
        node.ws.send(JSON.stringify(message));
      } catch (err) {
        delete node.pendingRequests[message.id];
        callback(err);
      }
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (node.pendingRequests[message.id]) {
          delete node.pendingRequests[message.id];
          callback(new Error('Request timeout'));
        }
      }, 10000);
    };
    
    // Register subscriber node
    node.registerSubscriber = function(subscriberNode) {
      node.subscribers.push(subscriberNode);
    };
    
    // Unregister subscriber node
    node.unregisterSubscriber = function(subscriberNode) {
      const index = node.subscribers.indexOf(subscriberNode);
      if (index > -1) {
        node.subscribers.splice(index, 1);
      }
    };
    
    // Connect on startup
    node.connect();
    
    // Cleanup on close
    node.on('close', function(done) {
      if (node.ws) {
        node.ws.close();
        node.ws = null;
      }
      done();
    });
  }
  
  RED.nodes.registerType('qsys-config', QSYSConfigNode);
};
