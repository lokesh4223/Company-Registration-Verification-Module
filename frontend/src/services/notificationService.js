// Simple notification service for real-time updates
class NotificationService {
  constructor() {
    this.listeners = {};
  }

  // Subscribe to events
  subscribe(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
    };
  }

  // Emit events
  emit(eventType, data) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(callback => callback(data));
    }
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService;