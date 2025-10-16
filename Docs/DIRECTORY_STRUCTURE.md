# Directory Structure

## Overview
This document describes the directory structure of the Company Registration system, explaining the purpose and contents of each folder and file to help developers navigate and understand the codebase.

## Root Directory
```
company-registration/
├── backend/                 # Node.js backend application
├── frontend/                # React frontend application
├── docs/                    # Project documentation
├── scripts/                 # Automation scripts
├── docker/                  # Docker configurations
├── kubernetes/              # Kubernetes manifests
├── database/                # Database setup scripts
├── .github/                 # GitHub configurations
├── .gitignore               # Git ignore file
├── README.md                # Project README
├── LICENSE                  # License information
├── package.json             # Root package.json
└── IMPLEMENTATION_PLAN.md   # Implementation plan
```

## Backend Directory Structure
```
backend/
├── server.js                # Main server file
├── package.json             # NPM package configuration
├── .env                     # Environment variables
├── .env.example             # Environment variables example
├── controllers/             # Request handlers
│   ├── companyController.js # Company management
│   └── userController.js    # User management
├── models/                  # Database models
│   ├── companyModel.js      # Company database operations
│   └── userModel.js         # User database operations
├── routes/                  # API routes
│   ├── companyRoutes.js     # Company API routes
│   └── userRoutes.js        # User API routes
├── middleware/              # Custom middleware
│   ├── authMiddleware.js    # Authentication middleware
│   └── validationMiddleware.js # Input validation
├── utils/                   # Utility functions
│   ├── database.js          # Database connection
│   ├── firebase.js          # Firebase integration
│   └── cloudinary.js        # Cloudinary integration
├── config/                  # Configuration files
│   └── db.js                # Database configuration
└── tests/                   # Test files
    ├── unit/                # Unit tests
    └── integration/         # Integration tests
```

## Frontend Directory Structure
```
frontend/
├── public/                  # Public assets
│   ├── index.html           # Main HTML file
│   ├── favicon.ico          # Favicon
│   └── manifest.json        # Web app manifest
├── src/                     # Source code
│   ├── components/          # Reusable components
│   │   ├── common/          # Common UI components
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components
│   │   └── widgets/         # Widget components
│   ├── pages/               # Page components
│   │   ├── Home/            # Home page
│   │   ├── Registration/    # Registration pages
│   │   ├── Dashboard/       # Dashboard pages
│   │   ├── Profile/         # Profile pages
│   │   └── Admin/           # Admin pages
│   ├── services/            # API services
│   │   ├── api.js           # API client configuration
│   │   ├── authService.js   # Authentication service
│   │   ├── companyService.js # Company service
│   │   └── userService.js   # User service
│   ├── store/               # Redux store
│   │   ├── index.js         # Store configuration
│   │   ├── actions/         # Action creators
│   │   ├── reducers/        # Reducers
│   │   └── selectors/       # Selector functions
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utility functions
│   ├── assets/              # Static assets
│   │   ├── images/          # Image files
│   │   ├── icons/           # Icon files
│   │   └── styles/          # CSS/SCSS files
│   ├── routes/              # Routing configuration
│   ├── App.js               # Main App component
│   ├── index.js             # Entry point
│   └── setupTests.js        # Test setup
├── tests/                   # Test files
│   ├── components/          # Component tests
│   ├── pages/               # Page tests
│   └── services/            # Service tests
├── node_modules/            # NPM dependencies
├── package.json             # NPM package configuration
└── package-lock.json        # NPM lock file
```

## Documentation Directory Structure
```
docs/
├── PROJECT_OVERVIEW.md      # Project overview
├── ARCHITECTURE.md          # System architecture
├── API_SPECS.md             # API specifications
├── SETUP_GUIDE.md           # Setup guide
├── SECURITY_GUIDELINES.md   # Security guidelines
├── CONTRIBUTING.md          # Contribution guidelines
├── ROADMAP.md               # Product roadmap
├── DEPLOYMENT.md            # Deployment guide
├── FRONTEND_BACKEND_SUMMARY.md # Frontend/backend summary
├── TESTING_STRATEGY.md      # Testing strategy
├── CODING_STANDARDS.md      # Coding standards
├── TESTING_SETUP.md         # Testing setup guide
├── DIRECTORY_STRUCTURE.md   # Directory structure (this file)
├── DOCUMENTATION_SUMMARY.md # Documentation summary
├── INTERNSHIP_ASSIGNMENT.md # Internship assignment requirements
├── diagrams/                # Architecture diagrams
├── api/                     # API documentation
│   └── Company_Registration_API.postman_collection.json
└── performance/             # Performance testing
    └── Company_Registration_Test_Plan.jmx
```

## Scripts Directory Structure
```
scripts/
├── deploy/                  # Deployment scripts
│   ├── deploy.sh            # Main deployment script
│   ├── backup.sh            # Backup script
│   └── rollback.sh          # Rollback script
├── database/                # Database scripts
│   ├── migrate.sh           # Migration script
│   ├── seed.sh              # Data seeding script
│   └── backup.sh            # Database backup script
├── testing/                 # Testing scripts
│   ├── run_tests.sh         # Test execution script
│   ├── coverage.sh          # Coverage report script
│   └── security_scan.sh     # Security scanning script
├── ci/                      # CI/CD scripts
│   ├── build.sh             # Build script
│   ├── test.sh              # Test script
│   └── deploy.sh            # CI/CD deployment script
├── utils/                   # Utility scripts
│   ├── setup.sh             # Development setup script
│   ├── cleanup.sh           # Cleanup script
│   └── health_check.sh      # Health check script
└── verify_database_setup.js # Database setup verification script
```

## Docker Directory Structure
```
docker/
├── backend.Dockerfile       # Backend Dockerfile
├── frontend.Dockerfile      # Frontend Dockerfile
├── docker-compose.yml       # Main Docker compose file
└── nginx.conf               # Nginx configuration
```

## Kubernetes Directory Structure
```
kubernetes/
├── base/                    # Base Kubernetes manifests
│   ├── namespace.yaml       # Namespace definition
│   ├── configmap.yaml       # ConfigMap definitions
│   ├── secrets.yaml         # Secret definitions
│   ├── deployment.yaml      # Deployment definitions
│   ├── service.yaml         # Service definitions
│   └── ingress.yaml         # Ingress definitions
├── overlays/                # Environment overlays
│   ├── development/         # Development environment
│   ├── staging/             # Staging environment
│   └── production/          # Production environment
├── charts/                  # Helm charts
└── manifests/               # Generated manifests
```

## Database Directory Structure
```
database/
├── create_tables.sql        # Main table creation script
├── 01_company_profile_table.sql # Company profile table script
├── 02_users_table.sql       # Users table script
├── 03_sample_data.sql       # Sample data script
└── README.md                # Database setup instructions
```

## GitHub Directory Structure
```
.github/
├── workflows/               # GitHub Actions workflows
│   ├── ci.yml               # Continuous integration
│   ├── cd.yml               # Continuous deployment
│   ├── codeql.yml           # Code scanning
│   └── dependabot.yml       # Dependency updates
├── ISSUE_TEMPLATE/          # Issue templates
│   ├── bug_report.md        # Bug report template
│   └── feature_request.md   # Feature request template
├── PULL_REQUEST_TEMPLATE/   # Pull request template
└── dependabot.yml           # Dependabot configuration
```

## Backend Apps Directory Details

### Companies App
```
apps/companies/
├── models/                  # Company models
│   ├── __init__.py
│   ├── company.py           # Company model
│   ├── address.py           # Address model
│   └── contact.py           # Contact model
├── views/                   # Company views
│   ├── __init__.py
│   ├── company_views.py     # Company viewsets
│   └── api_views.py         # API views
├── serializers/             # Company serializers
│   ├── __init__.py
│   ├── company_serializer.py # Company serializer
│   └── address_serializer.py # Address serializer
├── services/                # Company services
│   ├── __init__.py
│   └── company_service.py   # Company service logic
├── urls.py                  # Company URL patterns
├── admin.py                 # Django admin configuration
├── apps.py                  # App configuration
└── tests/                   # Company app tests
```

### Users App
```
apps/users/
├── models/                  # User models
├── views/                   # User views
├── serializers/             # User serializers
├── services/                # User services
├── urls.py                  # User URL patterns
├── admin.py                 # Django admin configuration
├── apps.py                  # App configuration
└── tests/                   # User app tests
```

### Registrations App
```
apps/registrations/
├── models/                  # Registration models
├── views/                   # Registration views
├── serializers/             # Registration serializers
├── services/                # Registration services
├── urls.py                  # Registration URL patterns
├── admin.py                 # Django admin configuration
├── apps.py                  # App configuration
└── tests/                   # Registration app tests
```

## Frontend Components Directory Details

### Common Components
```
src/components/common/
├── Button/                  # Button component
├── Input/                   # Input component
├── Select/                  # Select component
├── Modal/                   # Modal component
├── Table/                   # Table component
├── Card/                    # Card component
├── Alert/                   # Alert component
└── Loader/                  # Loader component
```

### Form Components
```
src/components/forms/
├── CompanyForm/             # Company registration form
├── AddressForm/             # Address form
├── ContactForm/             # Contact form
├── DocumentUploader/        # Document upload component
└── PaymentForm/             # Payment form
```

### Page Components
```
src/pages/
├── Home/                    # Home page
│   ├── Home.js              # Home component
│   └── Home.test.js         # Home tests
├── Registration/            # Registration pages
│   ├── Step1/               # Registration step 1
│   ├── Step2/               # Registration step 2
│   ├── Step3/               # Registration step 3
│   └── Confirmation/        # Confirmation page
└── Dashboard/               # Dashboard pages
```

## Test Directory Structure

### Backend Tests
```
tests/
├── unit/                    # Unit tests
│   ├── test_models/         # Model tests
│   ├── test_views/          # View tests
│   ├── test_serializers/    # Serializer tests
│   └── test_services/       # Service tests
├── integration/             # Integration tests
│   ├── test_api/            # API integration tests
│   ├── test_database/       # Database integration tests
│   └── test_services/       # Service integration tests
├── factories.py             # Test data factories
└── conftest.py              # Pytest configuration
```

### Frontend Tests
```
tests/
├── components/              # Component tests
├── pages/                   # Page tests
├── services/                # Service tests
└── utils/                   # Utility tests
```

## Configuration Files

### Environment Files
- `.env`: Default environment variables
- `.env.development`: Development environment variables
- `.env.production`: Production environment variables
- `.env.test`: Test environment variables

### Configuration Files
- `package.json`: NPM package configuration
- `requirements.txt`: Python production dependencies
- `requirements-dev.txt`: Python development dependencies
- `jest.config.js`: Jest testing configuration
- `webpack.config.js`: Webpack build configuration
- `cypress.json`: Cypress E2E testing configuration

## Naming Conventions

### Files and Directories
- Use lowercase with underscores for files (e.g., `company_service.py`)
- Use PascalCase for React components (e.g., `CompanyForm.js`)
- Use kebab-case for configuration files (e.g., `docker-compose.yml`)

### Code Organization
- Group related functionality in the same directory
- Separate concerns into different apps/modules
- Keep files focused and small
- Use index files for clean imports

## Best Practices

### Directory Organization
- Organize by feature rather than technology
- Keep related files together
- Use descriptive directory names
- Maintain consistent structure across apps

### File Management
- Keep files small and focused
- Use meaningful file names
- Separate configuration from implementation
- Document complex directory structures

### Version Control
- Include all necessary files in version control
- Exclude environment-specific files
- Use .gitignore for temporary files
- Document directory structure changes