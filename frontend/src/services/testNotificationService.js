// Test the notification service
import notificationService from './notificationService';

// Test subscription
const unsubscribe = notificationService.subscribe('test_event', (data) => {
  console.log('Received test event:', data);
});

// Test emission
notificationService.emit('test_event', { message: 'Hello, world!' });

// Clean up
unsubscribe();

export default notificationService;