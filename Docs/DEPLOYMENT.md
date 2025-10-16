# Deployment Guide

## Overview
This document provides detailed instructions for deploying the Company Registration system to various environments including staging, production, and disaster recovery setups.

## Deployment Environments

### Development
- Purpose: Local development and testing
- Infrastructure: Developer workstations
- Data: Sample/test data
- Security: Minimal (development only)

### Staging
- Purpose: Pre-production testing
- Infrastructure: Cloud instances (similar to production)
- Data: Anonymized production data
- Security: Production-equivalent

### Production
- Purpose: Live user-facing environment
- Infrastructure: Highly available cloud setup
- Data: Real customer data
- Security: Full security measures

## Deployment Methods

### Containerized Deployment (Recommended)

#### Prerequisites
- Docker v20.10+
- Docker Compose v1.29+
- Kubernetes cluster (for production)

#### Deploying with Docker Compose
1. Prepare environment configuration:
   ```bash
   cp .env.example .env
   # Edit .env with appropriate values
   ```

2. Build and start services:
   ```bash
   docker-compose up -d
   ```

3. Verify deployment:
   ```bash
   docker-compose ps
   ```

#### Deploying to Kubernetes
1. Prepare Kubernetes manifests:
   ```bash
   kubectl apply -f kubernetes/
   ```

2. Configure secrets:
   ```bash
   kubectl create secret generic app-secrets --from-env-file=.env
   ```

3. Deploy services:
   ```bash
   kubectl apply -f kubernetes/deployment.yaml
   kubectl apply -f kubernetes/service.yaml
   ```

### Traditional Deployment

#### Backend Deployment
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run database migrations:
   ```bash
   python manage.py migrate
   ```

3. Collect static files:
   ```bash
   python manage.py collectstatic
   ```

4. Start application server:
   ```bash
   gunicorn company_registration.wsgi:application --bind 0.0.0.0:8000
   ```

#### Frontend Deployment
1. Install dependencies:
   ```bash
   npm install
   ```

2. Build production assets:
   ```bash
   npm run build
   ```

3. Serve built files with Nginx or Apache

## Configuration Management

### Environment Variables
Required environment variables:
- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode flag (False in production)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `REDIS_URL`: Redis connection string for caching

### Secrets Management
- Use HashiCorp Vault for production secrets
- AWS Secrets Manager for cloud deployments
- Kubernetes secrets for containerized deployments
- Never store secrets in version control

## Database Deployment

### Initial Setup
1. Create database:
   ```sql
   CREATE DATABASE company_registration;
   CREATE USER company_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE company_registration TO company_user;
   ```

2. Run migrations:
   ```bash
   python manage.py migrate
   ```

### Data Migration
For migrating data between environments:
1. Export from source:
   ```bash
   python manage.py dumpdata > datadump.json
   ```

2. Import to destination:
   ```bash
   python manage.py loaddata datadump.json
   ```

## Monitoring and Health Checks

### Application Health
Endpoints for health checks:
- `/health/`: Basic health check
- `/health/db/`: Database connectivity
- `/health/cache/`: Cache connectivity
- `/metrics/`: Prometheus metrics

### Monitoring Setup
1. Configure logging:
   ```python
   LOGGING = {
       'version': 1,
       'disable_existing_loggers': False,
       'handlers': {
           'file': {
               'level': 'INFO',
               'class': 'logging.FileHandler',
               'filename': '/var/log/app.log',
           },
       },
       'loggers': {
           'django': {
               'handlers': ['file'],
               'level': 'INFO',
               'propagate': True,
           },
       },
   }
   ```

2. Set up alerting for critical metrics

## Backup and Recovery

### Backup Strategy
1. Daily database backups
2. Weekly full system backups
3. Real-time replication for critical data
4. Offsite storage of backups

### Recovery Process
1. Restore database from backup:
   ```bash
   pg_restore -d company_registration backup_file.dump
   ```

2. Restore application files from backup
3. Validate system functionality
4. Switch traffic to recovered system

## Rollback Procedures

### Automated Rollbacks
- Use blue-green deployment strategy
- Implement circuit breaker patterns
- Monitor key metrics for automatic rollback triggers

### Manual Rollbacks
1. Identify the last stable version
2. Revert code deployment
3. Rollback database migrations if needed:
   ```bash
   python manage.py migrate app_name previous_migration
   ```
4. Verify system functionality

## Performance Considerations

### Scaling
- Horizontal scaling for web servers
- Vertical scaling for database
- Content delivery network (CDN) for static assets
- Load balancing for high availability

### Caching
- Redis for session storage
- Database query caching
- HTTP caching headers
- Frontend asset caching

## Security Deployment Checklist

### Before Deployment
- [ ] SSL/TLS certificates installed and configured
- [ ] Firewall rules configured
- [ ] Security headers enabled
- [ ] Secrets properly managed
- [ ] Security scans completed

### After Deployment
- [ ] Penetration testing performed
- [ ] Security monitoring enabled
- [ ] Incident response procedures tested
- [ ] Compliance verification completed

## Troubleshooting

### Common Deployment Issues

1. **Database Connection Failure**
   - Verify database credentials
   - Check network connectivity
   - Ensure database server is running

2. **Application Startup Errors**
   - Check application logs
   - Verify environment variables
   - Confirm dependencies are installed

3. **Performance Issues**
   - Monitor resource utilization
   - Check database query performance
   - Review caching configuration

### Emergency Procedures
1. **System Outage**
   - Activate incident response team
   - Implement rollback if recent deployment
   - Communicate with stakeholders
   - Document incident and resolution

2. **Security Breach**
   - Isolate affected systems
   - Preserve evidence
   - Notify security team
   - Follow incident response plan

## Post-Deployment Validation

### Smoke Tests
- [ ] Application homepage loads
- [ ] User can register a company
- [ ] API endpoints respond correctly
- [ ] Database queries execute successfully

### Performance Tests
- [ ] Response time within acceptable limits
- [ ] System handles expected load
- [ ] Resource utilization within thresholds

### Security Tests
- [ ] SSL certificate valid
- [ ] No exposed sensitive endpoints
- [ ] Authentication working correctly
- [ ] Authorization enforced properly