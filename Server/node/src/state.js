class StateManager {
  constructor() {
    // Component cache: { componentName: { control: value, ... }, ... }
    this.componentCache = new Map();
    
    // Subscriptions: { subscriptionId: { component, control, clients: Set() }, ... }
    this.subscriptions = new Map();
    this.subscriptionId = 0;
    
    // Value history (optional, for trends)
    this.valueHistory = new Map();
    this.maxHistorySize = 100;
    
    // Statistics
    this.stats = {
      messagesSent: 0,
      messagesReceived: 0,
      errors: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
  }
  
  // Cache methods
  updateCache(component, control, value) {
    if (!this.componentCache.has(component)) {
      this.componentCache.set(component, new Map());
    }
    
    const controls = this.componentCache.get(component);
    controls.set(control, {
      value,
      timestamp: Date.now()
    });
    
    // Store in history
    const key = `${component}.${control}`;
    if (!this.valueHistory.has(key)) {
      this.valueHistory.set(key, []);
    }
    
    const history = this.valueHistory.get(key);
    history.push({ value, timestamp: Date.now() });
    
    // Limit history size
    if (history.length > this.maxHistorySize) {
      history.shift();
    }
  }
  
  getFromCache(component, control) {
    if (!this.componentCache.has(component)) {
      this.stats.cacheMisses++;
      return null;
    }
    
    const controls = this.componentCache.get(component);
    if (!controls.has(control)) {
      this.stats.cacheMisses++;
      return null;
    }
    
    this.stats.cacheHits++;
    return controls.get(control);
  }
  
  getAllComponents() {
    const components = [];
    
    for (const [name, controls] of this.componentCache.entries()) {
      const controlList = [];
      for (const [controlName, data] of controls.entries()) {
        controlList.push({
          name: controlName,
          value: data.value,
          timestamp: data.timestamp
        });
      }
      
      components.push({
        name,
        controls: controlList
      });
    }
    
    return components;
  }
  
  getComponent(component) {
    if (!this.componentCache.has(component)) {
      return null;
    }
    
    const controls = this.componentCache.get(component);
    const result = {
      name: component,
      controls: []
    };
    
    for (const [controlName, data] of controls.entries()) {
      result.controls.push({
        name: controlName,
        value: data.value,
        timestamp: data.timestamp
      });
    }
    
    return result;
  }
  
  getHistory(component, control, limit = 100) {
    const key = `${component}.${control}`;
    const history = this.valueHistory.get(key);
    
    if (!history) {
      return [];
    }
    
    return history.slice(-limit);
  }
  
  clearCache() {
    this.componentCache.clear();
    this.valueHistory.clear();
  }
  
  // Subscription methods
  subscribe(component, control, client) {
    const key = `${component}.${control}`;
    
    // Find existing subscription
    for (const [id, sub] of this.subscriptions.entries()) {
      if (sub.component === component && sub.control === control) {
        sub.clients.add(client);
        return id;
      }
    }
    
    // Create new subscription
    const id = ++this.subscriptionId;
    this.subscriptions.set(id, {
      component,
      control,
      clients: new Set([client])
    });
    
    return id;
  }
  
  unsubscribe(component, control, client) {
    for (const [id, sub] of this.subscriptions.entries()) {
      if (sub.component === component && sub.control === control) {
        sub.clients.delete(client);
        
        // Remove subscription if no clients left
        if (sub.clients.size === 0) {
          this.subscriptions.delete(id);
        }
        
        return true;
      }
    }
    
    return false;
  }
  
  unsubscribeClient(client) {
    for (const [id, sub] of this.subscriptions.entries()) {
      sub.clients.delete(client);
      
      if (sub.clients.size === 0) {
        this.subscriptions.delete(id);
      }
    }
  }
  
  getSubscribers(component, control) {
    for (const [id, sub] of this.subscriptions.entries()) {
      if (sub.component === component && sub.control === control) {
        return Array.from(sub.clients);
      }
    }
    
    return [];
  }
  
  getAllSubscriptions() {
    const result = [];
    
    for (const [id, sub] of this.subscriptions.entries()) {
      result.push({
        id,
        component: sub.component,
        control: sub.control,
        clients: sub.clients.size
      });
    }
    
    return result;
  }
  
  // Stats methods
  incrementStat(name) {
    if (this.stats.hasOwnProperty(name)) {
      this.stats[name]++;
    }
  }
  
  getStats() {
    return {
      ...this.stats,
      components: this.componentCache.size,
      subscriptions: this.subscriptions.size,
      cacheSize: this.getCacheSize()
    };
  }
  
  getCacheSize() {
    let size = 0;
    for (const controls of this.componentCache.values()) {
      size += controls.size;
    }
    return size;
  }
}

module.exports = new StateManager();
