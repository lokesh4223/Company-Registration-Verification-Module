# Real-time Notifications Implementation

## Overview
This document describes the implementation of real-time notifications in the Company Registration system. The feature provides immediate feedback to users when they post jobs, with updates appearing in the notification bell icon and relevant dashboard sections.

## Architecture

### Notification Service
A centralized notification service (`notificationService.js`) manages event subscriptions and emissions across components using a publish-subscribe pattern.

### Components Integration
1. **PostJob Component**: Emits job_posted events when a job is successfully created
2. **CombinedDashboard Component**: Listens for job_posted events to update notifications and dashboard stats
3. **Overview Component**: Listens for job_posted events to refresh job statistics and recent jobs
4. **MyJobs Component**: Listens for job_posted events to refresh the job listings

## Implementation Details

### Notification Service
```javascript
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
```

### Event Flow
1. User submits job form in PostJob component
2. Job is saved to database via API
3. PostJob component emits 'job_posted' event with job title
4. CombinedDashboard updates notification count and adds notification to list
5. Overview component refreshes job statistics and recent jobs
6. MyJobs component refreshes job listings

### Component Updates

#### PostJob Component
- Emits notification when job is successfully posted
- Uses notificationService.emit('job_posted', { jobTitle })

#### CombinedDashboard Component
- Subscribes to 'job_posted' events
- Updates notification badge count
- Adds new notification to notification list
- Updates dashboard statistics (Total Jobs count)

#### Overview Component
- Subscribes to 'job_posted' events
- Refreshes dashboard data including job statistics and recent jobs

#### MyJobs Component
- Subscribes to 'job_posted' events
- Refreshes job listings to include newly posted job

## Real-time Features

### Notification Bell
- Badge count increases when job is posted
- New notification appears at top of notification list
- Notification includes job title and "Just now" timestamp

### Dashboard Updates
- Total Jobs statistic updates immediately
- Recent Jobs section shows newly posted job
- No page refresh required

### My Jobs Page
- Newly posted job appears in job listings
- Search and filter functionality works with new job
- Pagination updates if necessary

## Benefits

1. **Immediate Feedback**: Users see confirmation of job posting without manual refresh
2. **Consistent State**: All relevant components update simultaneously
3. **Scalable**: Easy to add new event types and subscribers
4. **Decoupled**: Components communicate through service without direct dependencies

## Testing

To test the real-time notification functionality:

1. Navigate to the Post a Job page
2. Fill in job details and submit the form
3. Observe:
   - Notification bell badge count increases
   - New notification appears in notification dropdown
   - Dashboard statistics update (Total Jobs count)
   - Recent Jobs section shows new job
   - My Jobs page shows new job in listings

## Future Enhancements

1. **WebSocket Integration**: Replace polling with WebSocket for true real-time updates
2. **Notification Persistence**: Store notifications in database for persistence across sessions
3. **Notification Types**: Add more notification types (application received, profile views, etc.)
4. **Notification Settings**: Allow users to customize notification preferences
5. **Push Notifications**: Implement browser push notifications for offline users