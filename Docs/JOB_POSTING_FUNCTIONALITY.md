# Job Posting Functionality Documentation

## Overview
This document describes the implementation of the job posting functionality in the Company Registration system. The feature allows companies to post job openings, manage them, and track applications.

## Database Schema

### Jobs Table
The jobs table stores all job postings with the following structure:

```sql
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  location VARCHAR(255) NOT NULL,
  employment_type VARCHAR(50) NOT NULL,
  experience_level VARCHAR(50),
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  skills JSONB,
  is_remote BOOLEAN DEFAULT false,
  is_urgent BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending',
  applicants_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES company_profile(id) ON DELETE CASCADE
);
```

### Columns
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | Primary Key, Auto-increment | Unique job identifier |
| company_id | INTEGER | Not Null, Foreign Key | References company_profile(id) |
| title | VARCHAR(255) | Not Null | Job title |
| department | VARCHAR(100) | Nullable | Department name |
| location | VARCHAR(255) | Not Null | Job location |
| employment_type | VARCHAR(50) | Not Null | Employment type (Full-time, Part-time, etc.) |
| experience_level | VARCHAR(50) | Nullable | Experience level required |
| salary_min | INTEGER | Nullable | Minimum salary |
| salary_max | INTEGER | Nullable | Maximum salary |
| description | TEXT | Not Null | Job description |
| requirements | TEXT | Nullable | Job requirements |
| responsibilities | TEXT | Nullable | Job responsibilities |
| skills | JSONB | Nullable | Required skills (array of strings) |
| is_remote | BOOLEAN | Default false | Remote work availability |
| is_urgent | BOOLEAN | Default false | Urgent hiring flag |
| status | VARCHAR(20) | Default 'pending' | Job status (pending, active, closed) |
| applicants_count | INTEGER | Default 0 | Number of applicants |
| created_at | TIMESTAMP | Not Null, Default CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Not Null, Default CURRENT_TIMESTAMP | Record update timestamp |

### Constraints
- Primary Key: `id`
- Foreign Key: `company_id` references `company_profile(id)` with CASCADE delete
- Not Null: `title`, `location`, `employment_type`, `description`
- Default Values: `status` = 'pending', `applicants_count` = 0, `is_remote` = false, `is_urgent` = false

### Indexes
```sql
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON jobs(employment_type);
```

### Triggers
Automatic timestamp updates are handled by triggers:
- `update_jobs_updated_at`: Updates `updated_at` in jobs table on record modification

## API Endpoints

### Create Job
```
POST /api/jobs
```
Creates a new job posting for the authenticated company.

**Request Body:**
```json
{
  "title": "Frontend Developer",
  "department": "Engineering",
  "location": "Bangalore",
  "employmentType": "Full-time",
  "experience": "Mid Level",
  "salaryMin": 50000,
  "salaryMax": 80000,
  "description": "We are looking for a skilled Frontend Developer...",
  "requirements": "Bachelor's degree in Computer Science...",
  "responsibilities": "Develop user-facing features...",
  "skills": ["JavaScript", "React", "CSS"],
  "remote": false,
  "urgent": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job posted successfully",
  "data": {
    "id": 1,
    "company_id": 1,
    "title": "Frontend Developer",
    "department": "Engineering",
    "location": "Bangalore",
    "employment_type": "Full-time",
    "experience_level": "Mid Level",
    "salary_min": 50000,
    "salary_max": 80000,
    "description": "We are looking for a skilled Frontend Developer...",
    "requirements": "Bachelor's degree in Computer Science...",
    "responsibilities": "Develop user-facing features...",
    "skills": ["JavaScript", "React", "CSS"],
    "is_remote": false,
    "is_urgent": true,
    "status": "pending",
    "applicants_count": 0,
    "created_at": "2025-10-15T10:30:00.000Z",
    "updated_at": "2025-10-15T10:30:00.000Z"
  }
}
```

### Get Jobs
```
GET /api/jobs
```
Retrieves all jobs for the authenticated company.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company_id": 1,
      "title": "Frontend Developer",
      "department": "Engineering",
      "location": "Bangalore",
      "employment_type": "Full-time",
      "experience_level": "Mid Level",
      "salary_min": 50000,
      "salary_max": 80000,
      "description": "We are looking for a skilled Frontend Developer...",
      "requirements": "Bachelor's degree in Computer Science...",
      "responsibilities": "Develop user-facing features...",
      "skills": ["JavaScript", "React", "CSS"],
      "is_remote": false,
      "is_urgent": true,
      "status": "active",
      "applicants_count": 5,
      "created_at": "2025-10-15T10:30:00.000Z",
      "updated_at": "2025-10-15T10:30:00.000Z"
    }
  ]
}
```

### Get Job by ID
```
GET /api/jobs/:id
```
Retrieves a specific job by ID.

### Update Job
```
PUT /api/jobs/:id
```
Updates a specific job.

### Delete Job
```
DELETE /api/jobs/:id
```
Deletes a specific job.

### Update Job Status
```
PUT /api/jobs/:id/status
```
Updates the status of a job.

**Request Body:**
```json
{
  "status": "active"
}
```

### Apply to Job
```
POST /api/jobs/:id/apply
```
Allows candidates to apply to a job (increments applicant count).

## Frontend Components

### PostJob Component
Located at `frontend/src/components/dashboard/PostJob.jsx`, this component provides the job posting form with validation and submission to the backend.

### MyJobs Component
Located at `frontend/src/components/dashboard/MyJobs.jsx`, this component displays all jobs posted by the company with filtering and pagination.

### Overview Component
Located at `frontend/src/components/dashboard/Overview.jsx`, this component shows job statistics and recent job postings on the dashboard.

## Setup Instructions

1. Run the database migration to create the jobs table:
   ```bash
   cd backend
   npm run setup-jobs
   ```

2. Start the backend server:
   ```bash
   npm run dev
   ```

3. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Testing

To test the job posting functionality:

1. Log in as a company user
2. Complete your company profile if not already done
3. Navigate to "Post a Job" from the dashboard
4. Fill in the job details and submit
5. Check "My Jobs" to see the posted job
6. Verify the job appears in the dashboard overview

## Error Handling

The system handles various error scenarios:
- Validation errors for required fields
- Authentication errors for unauthorized access
- Database errors with proper logging
- Network errors with user-friendly messages

## Future Enhancements

Planned improvements:
- Job application management
- Candidate profile integration
- Advanced job search and filtering
- Email notifications for job applications
- Job sharing functionality