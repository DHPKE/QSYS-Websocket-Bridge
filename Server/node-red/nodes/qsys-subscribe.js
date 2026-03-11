module.exports = function(RED) {
  function QSYSSubscribeNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    
    node.bridge = RED.nodes.getNode(config.bridge);
    node.component = config.component;
    node.control = config.control;
    node.subscribed = false;
    node.subscriptionId = null;
    
    if (!node.bridge) {
      node.error('No Q-SYS Bridge configured');
      return;
    }
    
    // Update status based on connection
    function updateStatus() {
      if (node.bridge.connected) {
        if (node.subscribed) {
          node.status({ fill: 'green', shape: 'dot', text: 'subscribed' });
        } else {
          node.status({ fill: 'yellow', shape: 'ring', text: 'not subscribed' });
        }
      } else {
        node.status({ fill: 'red', shape: 'ring', text: 'disconnected' });
      }
    }
    
    // Subscribe to control changes
    function subscribe() {
      if (!node.component || !node.control) {
        node.error('Component and control must be specified');
        return;
      }
      
      if (node.subscribed) {
        return;
      }
      
      const request = {
        type: 'subscribe',
        component: node.component,
        control: node.control
      };
      
      node.bridge.request(request, (err, response) => {
        if (err) {
          node.error('Failed to subscribe: ' + err.message);
          updateStatus();
          return;
        }
        
        if (response.status === 'ok') {
          node.subscribed = true;
          node.subscriptionId = response.id;
          updateStatus();
          node.log(`Subscribed to ${node.component}.${node.control}`);
        } else {
          node.error('Q-SYS error: ' + response.error);
          updateStatus();
        }
      });
    }
    
    // Unsubscribe from control changes
    function unsubscribe() {
      if (!node.subscribed) {
        return;
      }
      
      const request = {
        type: 'unsubscribe',
        component: node.component,
        control: node.control
      };
      
      node.bridge.request(request, (err, response) => {
        if (err) {
          node.error('Failed to unsubscribe: ' + err.message);
        }
        node.subscribed = false;
        node.subscriptionId = null;
        updateStatus();
      });
    }
    
    // Handle updates from Q-SYS
    function handleUpdate(update) {
      // Check if this update is for our subscription
      if (update.component === node.component && update.control === node.control) {
        const msg = {
          payload: update.value,
          component: update.component,
          control: update.control,
          timestamp: update.timestamp,
          qsys: update
        };
        
        node.send(msg);
        node.status({ fill: 'green', shape: 'dot', text: `${update.value}` });
        setTimeout(updateStatus, 2000);
      }
    }
    
    // Register listeners
    node.bridge.on('connected', () => {
      updateStatus();
      subscribe();
    });
    
    node.bridge.on('disconnected', () => {
      node.subscribed = false;
      updateStatus();
    });
    
    node.bridge.on('update', handleUpdate);
    
    // Subscribe if already connected
    if (node.bridge.connected) {
      subscribe();
    }
    
    updateStatus();
    
    // Handle manual subscription via input
    node.on('input', function(msg) {
      const component = msg.component || node.component;
      const control = msg.control || node.control;
      
      if (component && control) {
        node.component = component;
        node.control = control;
        
        if (node.subscribed) {
          unsubscribe();
        }
        
        subscribe();
      }
    });
    
    node.on('close', function() {
      unsubscribe();
      node.bridge.removeListener('connected', updateStatus);
      node.bridge.removeListener('disconnected', updateStatus);
      node.bridge.removeListener('update', handleUpdate);
    });
  }
  
  RED.nodes.registerType('qsys-subscribe', QSYSSubscribeNode);
};
