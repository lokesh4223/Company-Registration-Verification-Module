# Database Setup Guide

## Overview
This guide provides step-by-step instructions for setting up the PostgreSQL database for the Company Registration project.

## Prerequisites
- PostgreSQL 12 or higher installed
- Node.js and npm installed
- Basic understanding of database management

## Installation Steps

### 1. Install PostgreSQL
If PostgreSQL is not already installed:

#### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Note the password you set for the postgres user

#### macOS
```bash
brew install postgresql
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### 2. Start PostgreSQL Service

#### Windows
- PostgreSQL service should start automatically after installation
- If not, start it from Services management console

#### macOS
```bash
brew services start postgresql
```

#### Ubuntu/Debian
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Create Database and User

1. Connect to PostgreSQL as superuser:
```bash
# Windows (use the PostgreSQL command prompt)
psql -U postgres

# macOS/Linux
sudo -u postgres psql
```

2. Create the database:
```sql
CREATE DATABASE company_registration;
```

3. Create a dedicated user (optional but recommended):
```sql
CREATE USER company_user WITH PASSWORD 'company_password';
GRANT ALL PRIVILEGES ON DATABASE company_registration TO company_user;
```

4. Exit PostgreSQL:
```sql
\q
```

### 4. Update Environment Configuration

Edit the `.env` file in the backend directory:
```env
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_registration
DB_USER=postgres  # or company_user if you created a dedicated user
DB_PASSWORD=your_postgres_password  # or company_password if using dedicated user
```

### 5. Create Database Tables

Run the database schema scripts:

1. Navigate to the database directory:
```bash
cd database
```

2. Execute the schema creation script:
```bash
psql -U postgres -d company_registration -f create_tables.sql
```

Or run each script individually:
```bash
psql -U postgres -d company_registration -f 01_company_profile_table.sql
psql -U postgres -d company_registration -f 02_users_table.sql
psql -U postgres -d company_registration -f 03_sample_data.sql
```

### 6. Test Database Connection

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Test the connection:
```bash
node test_db_connection.js
```

### 7. Run Backend Server

Start the backend server:
```bash
npm run dev
```

The server should start on port 3001 and connect to the database successfully.

## Troubleshooting

### Common Issues

#### 1. Authentication Failed
- Verify the username and password in `.env` file
- Ensure the PostgreSQL user exists and has proper permissions
- Check if PostgreSQL is running on the correct port

#### 2. Database Does Not Exist
- Make sure you created the database as described in step 3
- Verify the database name matches what's in your `.env` file

#### 3. Connection Refused
- Ensure PostgreSQL service is running
- Check firewall settings if connecting remotely
- Verify the host and port settings

#### 4. Permission Denied
- Grant proper privileges to the database user
- Check PostgreSQL configuration files (pg_hba.conf)

### Verifying Installation

To verify everything is working correctly:

1. Check PostgreSQL version:
```bash
psql --version
```

2. Connect to your database:
```bash
psql -U your_username -d company_registration
```

3. List tables:
```sql
\dt
```

You should see the `users` and `company_profile` tables.

## Additional Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Node.js PostgreSQL Client: https://node-postgres.com/