module.exports = function(RED) {
  function QSYSListNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    
    node.bridge = RED.nodes.getNode(config.bridge);
    
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
      // Send list request
      const request = {
        type: 'list'
      };
      
      node.bridge.request(request, (err, response) => {
        if (err) {
          node.error('Failed to list components: ' + err.message, msg);
          node.status({ fill: 'red', shape: 'dot', text: 'error' });
          setTimeout(updateStatus, 2000);
          return;
        }
        
        if (response.status === 'ok') {
          msg.payload = response.components;
          msg.qsys = response;
          
          node.send(msg);
          node.status({ fill: 'green', shape: 'dot', text: `${response.components.length} components` });
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
  
  RED.nodes.registerType('qsys-list', QSYSListNode);
};
