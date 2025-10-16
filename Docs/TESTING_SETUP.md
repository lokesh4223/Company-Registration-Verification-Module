# Testing Setup Guide

## Overview
This document provides detailed instructions for setting up the testing environment for the Company Registration system, including installation of testing tools, configuration, and execution procedures.

## Prerequisites

### System Requirements
- Operating System: Windows 10/11, macOS 10.15+, or Ubuntu 18.04+
- RAM: Minimum 8GB (16GB recommended)
- Disk Space: Minimum 5GB free space
- Python 3.8+
- Node.js 16+
- PostgreSQL 13+ (for integration tests)

### Software Dependencies
- Git v2.30+
- Docker (optional, for containerized testing)
- Java 11+ (for performance testing tools)

## Backend Testing Setup (Python/Django)

### 1. Install Testing Dependencies

#### Install Python Testing Libraries
```bash
cd backend
pip install -r requirements-dev.txt
```

This installs:
- pytest (testing framework)
- pytest-django (Django integration)
- pytest-cov (coverage reporting)
- factory-boy (test data generation)
- mock (mocking library)
- black (code formatting)
- flake8 (linting)

#### Install Additional Tools
```bash
pip install coverage bandit
```

### 2. Configure Test Environment

#### Create Test Database
```sql
CREATE DATABASE company_registration_test;
CREATE USER test_user WITH PASSWORD 'test_password';
GRANT ALL PRIVILEGES ON DATABASE company_registration_test TO test_user;
```

#### Configure Test Settings
Create `backend/company_registration/settings/test.py`:
```python
from .base import *

# Test-specific settings
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'company_registration_test',
        'USER': 'test_user',
        'PASSWORD': 'test_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Faster password hashing for tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable migrations for faster tests
class DisableMigrations:
    def __contains__(self, item):
        return True
    
    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Email backend for testing
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
```

### 3. Run Backend Tests

#### Execute Unit Tests
```bash
cd backend
python -m pytest tests/unit/
```

#### Execute Integration Tests
```bash
python -m pytest tests/integration/
```

#### Run Tests with Coverage
```bash
python -m pytest --cov=company_registration --cov-report=html
```

#### Run Specific Test Files
```bash
python -m pytest tests/unit/test_models.py
```

#### Run Tests with Verbose Output
```bash
python -m pytest -v
```

## Frontend Testing Setup (JavaScript/React)

### 1. Install Testing Dependencies
```bash
cd frontend
npm install
```

This installs:
- Jest (testing framework)
- React Testing Library (React component testing)
- Cypress (end-to-end testing)
- Enzyme (legacy component testing)
- @testing-library/jest-dom (DOM testing utilities)

### 2. Configure Test Environment

#### Update package.json Scripts
```json
{
  "scripts": {
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage",
    "test:watch": "react-scripts test --watch",
    "eject": "react-scripts eject"
  }
}
```

#### Configure Jest
Create `frontend/jest.config.js`:
```javascript
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/serviceWorker.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
};
```

### 3. Run Frontend Tests

#### Execute Unit Tests
```bash
cd frontend
npm test
```

#### Run Tests with Coverage
```bash
npm run test:coverage
```

#### Run Specific Test Files
```bash
npm test src/components/Button.test.js
```

#### Run Tests in Watch Mode
```bash
npm run test:watch
```

## API Testing Setup

### 1. Install Postman
Download and install Postman from https://www.postman.com/downloads/

### 2. Import Collection
Import the Company Registration API collection from `docs/api/Company_Registration_API.postman_collection.json`

### 3. Configure Environment
Create a new environment in Postman with the following variables:
- `base_url`: http://localhost:8000/api
- `auth_token`: (leave empty, populate after login)

### 4. Run API Tests
```bash
newman run Company_Registration_API.postman_collection.json -e test_environment.json
```

## End-to-End Testing Setup (Cypress)

### 1. Install Cypress
```bash
cd frontend
npm install cypress --save-dev
```

### 2. Open Cypress
```bash
npx cypress open
```

### 3. Configure Cypress
Create `frontend/cypress.json`:
```json
{
  "baseUrl": "http://localhost:3000",
  "viewportWidth": 1280,
  "viewportHeight": 720,
  "defaultCommandTimeout": 10000,
  "pageLoadTimeout": 60000
}
```

### 4. Run E2E Tests
```bash
npx cypress run
```

## Performance Testing Setup (JMeter)

### 1. Install JMeter
Download Apache JMeter from https://jmeter.apache.org/download_jmeter.cgi

### 2. Install Plugins
Install the following plugins:
- Custom Thread Groups
- JSON/YAML Plugins
- WebDriver Sampler

### 3. Import Test Plan
Import the test plan from `docs/performance/Company_Registration_Test_Plan.jmx`

### 4. Run Performance Tests
```bash
jmeter -n -t Company_Registration_Test_Plan.jmx -l results.jtl
```

## Security Testing Setup

### 1. Install OWASP ZAP
Download OWASP ZAP from https://www.zaproxy.org/download/

### 2. Install Bandit (Python Security Scanner)
```bash
pip install bandit
```

### 3. Install npm audit
```bash
cd frontend
npm install -g npm-audit
```

### 4. Run Security Scans

#### Run Bandit
```bash
bandit -r backend/
```

#### Run npm audit
```bash
cd frontend
npm audit
```

## Test Data Setup

### 1. Install Factory Boy
```bash
pip install factory-boy
```

### 2. Create Test Factories
Example factory for Company model:
```python
# backend/tests/factories.py
import factory
from company.models import Company

class CompanyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Company
    
    name = factory.Faker('company')
    registration_number = factory.Sequence(lambda n: f'REG{n:06d}')
    email = factory.Faker('email')
    phone = factory.Faker('phone_number')
```

### 3. Generate Test Data
```python
# In your tests
from tests.factories import CompanyFactory

company = CompanyFactory()
```

## Continuous Integration Setup

### 1. GitHub Actions Configuration
Create `.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.8
    
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
        pip install -r requirements-dev.txt
    
    - name: Run tests
      run: |
        cd backend
        python -m pytest --cov=company_registration
    
    - name: Run linting
      run: |
        cd backend
        flake8 .
```

### 2. Configure Pre-commit Hooks
Install pre-commit:
```bash
pip install pre-commit
```

Create `.pre-commit-config.yaml`:
```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 21.5b1
    hooks:
      - id: black
        language_version: python3.8
  
  - repo: https://github.com/pycqa/flake8
    rev: 3.9.2
    hooks:
      - id: flake8
```

Install hooks:
```bash
pre-commit install
```

## Docker Testing Environment

### 1. Create Docker Compose for Testing
Create `docker-compose.test.yml`:
```yaml
version: '3.8'

services:
  db-test:
    image: postgres:13
    environment:
      POSTGRES_DB: company_registration_test
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_password
    ports:
      - "5433:5432"
  
  redis-test:
    image: redis:6
    ports:
      - "6380:6379"
```

### 2. Run Test Environment
```bash
docker-compose -f docker-compose.test.yml up -d
```

## Troubleshooting

### Common Issues and Solutions

1. **Database Connection Failed**
   - Check if PostgreSQL is running
   - Verify database credentials
   - Ensure test database exists

2. **Missing Dependencies**
   - Run `pip install -r requirements-dev.txt` again
   - Check Python version compatibility

3. **Test Database Permissions**
   - Grant all privileges to test user
   - Check PostgreSQL pg_hba.conf configuration

4. **Port Already in Use**
   - Change ports in configuration files
   - Kill processes using required ports

5. **Coverage Report Generation Failed**
   - Check write permissions in project directory
   - Ensure sufficient disk space

### Debugging Test Failures

#### Enable Verbose Logging
```bash
python -m pytest -v -s
```

#### Run Tests with Debugging
```bash
python -m pytest --pdb
```

#### Capture Test Output
```bash
python -m pytest --capture=no
```

## Best Practices

### Test Organization
- Organize tests by type (unit, integration, e2e)
- Use descriptive test names
- Keep tests independent
- Clean up test data after each test

### Test Execution
- Run tests frequently during development
- Execute full test suite before committing
- Use parallel execution for faster feedback
- Monitor test execution times

### Test Maintenance
- Update tests when functionality changes
- Remove obsolete tests
- Refactor tests for better maintainability
- Review test coverage regularly

## Monitoring and Reporting

### Test Results Dashboard
- Integrate with CI/CD pipeline
- Display pass/fail rates
- Show code coverage metrics
- Track test execution times

### Performance Metrics
- Test execution duration
- Resource utilization during tests
- Test stability (flaky test detection)
- Coverage trends over time

## Updating Test Environment

### Adding New Test Dependencies
1. Add to `requirements-dev.txt` (backend)
2. Add to `package.json` (frontend)
3. Update CI/CD configuration
4. Document new dependencies

### Updating Test Configuration
1. Review configuration files
2. Update documentation
3. Test configuration changes
4. Communicate changes to team