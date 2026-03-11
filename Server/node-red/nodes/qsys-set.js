module.exports = function(RED) {
  function QSYSSetNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    
    node.bridge = RED.nodes.getNode(config.bridge);
    node.component = config.component;
    node.control = config.control;
    node.value = config.value;
    
    if (!node.bridge) {
      node.error('No Q-SYS Bridge configured');
      return;
    }
    
    // Update status based on connection
    function updateStatus() {
      if (node.bridge.connected) {
        node.status({ fill: 'green', shape: 'dot', text: 'connected' });
      } else {
        node.status({ fill: 'red', shape: 'ring', text: 'disconnected' });
      }
    }
    
    node.bridge.on('connected', updateStatus);
    node.bridge.on('disconnected', updateStatus);
    updateStatus();
    
    node.on('input', function(msg) {
      // Get component, control, and value from config or msg
      const component = msg.component || node.component;
      const control = msg.control || node.control;
      let value = msg.payload;
      
      // Use config value if no payload provided
      if (value === undefined && node.value !== '') {
        value = node.value;
        // Try to parse as number
        if (!isNaN(value)) {
          value = parseFloat(value);
        }
      }
      
      if (!component || !control) {
        node.error('Component and control must be specified', msg);
        return;
      }
      
      if (value === undefined) {
        node.error('Value must be specified (via msg.payload or config)', msg);
        return;
      }
      
      // Send set request
      const request = {
        type: 'set',
        component: component,
        control: control,
        value: value
      };
      
      node.bridge.request(request, (err, response) => {
        if (err) {
          node.error('Failed to set value: ' + err.message, msg);
          node.status({ fill: 'red', shape: 'dot', text: 'error' });
          setTimeout(updateStatus, 2000);
          return;
        }
        
        if (response.status === 'ok') {
          msg.component = component;
          msg.control = control;
          msg.value = value;
          msg.qsys = response;
          
          node.send(msg);
          node.status({ fill: 'green', shape: 'dot', text: `set: ${value}` });
          setTimeout(updateStatus, 2000);
        } else {
          node.error('Q-SYS error: ' + response.error, msg);
          node.status({ fill: 'yellow', shape: 'dot', text: 'error' });
          setTimeout(updateStatus, 2000);
        }
      });
    });
    
    node.on('close', function() {
      node.bridge.removeListener('connected', updateStatus);
      node.bridge.removeListener('disconnected', updateStatus);
    });
  }
  
  RED.nodes.registerType('qsys-set', QSYSSetNode);
};
