# Setup Guide

## Overview
This guide provides step-by-step instructions for setting up the Company Registration system for development and production environments.

For internship assignment setup instructions, please refer to the specific requirements in [INTERNSHIP_ASSIGNMENT.md](INTERNSHIP_ASSIGNMENT.md).

## Prerequisites

### System Requirements
- Operating System: Windows 10/11, macOS 10.15+, or Ubuntu 18.04+
- RAM: Minimum 8GB (16GB recommended)
- Disk Space: Minimum 10GB free space
- Internet Connection: Required for dependency installation

### Software Dependencies
- Node.js v16+ (for frontend)
- Python 3.8+ (for backend)
- PostgreSQL 13+ (primary database)
- Redis 6+ (for caching)
- Docker (optional, for containerized deployment)

## Development Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/company-registration.git
cd company-registration
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

#### Configure Environment Variables
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/company_registration
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
DEBUG=True
```

#### Run Database Migrations
```bash
python manage.py migrate
```

#### Start the Backend Server
```bash
python manage.py runserver
```

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

#### Start the Frontend Development Server
```bash
npm start
```

## Production Environment Setup

### Using Docker (Recommended)

#### Build and Run Containers
```bash
docker-compose up -d
```

#### Configure Production Environment Variables
Update the `.env.production` file with production values:
```env
DATABASE_URL=postgresql://user:password@db:5432/company_registration
REDIS_URL=redis://redis:6379/0
SECRET_KEY=your-production-secret-key
DEBUG=False
```

### Manual Installation

#### Backend
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set production environment variables

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Collect static files:
   ```bash
   python manage.py collectstatic
   ```

5. Start the server with Gunicorn:
   ```bash
   gunicorn company_registration.wsgi:application --bind 0.0.0.0:8000
   ```

#### Frontend
1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the production bundle:
   ```bash
   npm run build
   ```

3. Serve the built files using Nginx or similar web server

## Database Configuration

### PostgreSQL Setup
1. Install PostgreSQL
2. Create database:
   ```sql
   CREATE DATABASE company_registration;
   ```
3. Create user and grant privileges:
   ```sql
   CREATE USER company_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE company_registration TO company_user;
   ```

### Initial Data Seeding
Load initial data:
```bash
python manage.py loaddata initial_data.json
```

## Testing the Setup

### Run Backend Tests
```bash
cd backend
python manage.py test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check if PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure the database exists

2. **Port Already in Use**
   - Change the port in configuration
   - Kill the process using the port

3. **Missing Dependencies**
   - Run `pip install -r requirements.txt` again
   - Check Python version compatibility

### Getting Help
If you encounter issues not covered in this guide:
1. Check the [FAQ](FAQ.md)
2. Review logs in the `logs/` directory
3. Contact the development team