# Database Schema Documentation

## Overview
This document describes the database schema for the Company Registration system. The database is normalized with two main tables: `users` and `company_profile`, linked by a foreign key relationship.

## Database Structure

### Users Table
The `users` table stores user authentication and personal details.

#### Schema
```sql
CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    full_name character varying(255) NOT NULL,
    signup_type character varying(1) NOT NULL DEFAULT 'e',
    gender character(1) NOT NULL,
    mobile_no character varying(20) NOT NULL,
    is_mobile_verified boolean DEFAULT false,
    is_email_verified boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT gender_check CHECK ((gender = ANY (ARRAY['m'::bpchar, 'f'::bpchar, 'o'::bpchar]))),
    CONSTRAINT valid_mobile_format CHECK (((mobile_no)::text ~ '^\+[0-9]{1,3}[0-9]{4,14}$'::text) OR ((mobile_no)::text ~ '^[0-9]{4,14}$'::text))
);
```

#### Columns
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | Primary Key, Auto-increment | Unique user identifier |
| email | character varying(255) | Not Null, Unique | User's email address |
| password | text | Not Null | Hashed password (using bcrypt) |
| full_name | character varying(255) | Not Null | User's full name |
| signup_type | character varying(1) | Not Null, Default 'e' | Signup type ('e' for email) |
| gender | character(1) | Not Null, Values: 'm', 'f', 'o' | Gender (male, female, other) |
| mobile_no | character varying(20) | Not Null, Unique | Mobile number with country code |
| is_mobile_verified | boolean | Default false | Mobile verification status |
| is_email_verified | boolean | Default false | Email verification status |
| created_at | timestamp | Not Null, Default CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | timestamp | Not Null, Default CURRENT_TIMESTAMP | Record update timestamp |

#### Constraints
- Primary Key: `id`
- Unique Constraints: `email`, `mobile_no`
- Check Constraints:
  - `gender_check`: Gender must be 'm', 'f', or 'o'
  - `valid_mobile_format`: Mobile number must follow E.164 format or national format

### Company Profile Table
The `company_profile` table stores company-specific details, linked to users via `owner_id`.

#### Schema
```sql
CREATE TABLE public.company_profile (
    id integer NOT NULL,
    owner_id integer NOT NULL,
    company_name text NOT NULL,
    address text NOT NULL,
    city character varying(50) NOT NULL,
    state character varying(50) NOT NULL,
    country character varying(50) NOT NULL,
    postal_code character varying(20) NOT NULL,
    website text,
    logo_url text,
    banner_url text,
    industry text NOT NULL,
    founded_date date,
    description text,
    social_links jsonb,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### Columns
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | Primary Key, Auto-increment | Unique company identifier |
| owner_id | integer | Not Null, Foreign Key | References users(id) |
| company_name | text | Not Null | Company name |
| address | text | Not Null | Company address |
| city | character varying(50) | Not Null | City |
| state | character varying(50) | Not Null | State |
| country | character varying(50) | Not Null | Country |
| postal_code | character varying(20) | Not Null | Postal code |
| website | text | Nullable | Company website URL |
| logo_url | text | Nullable | Cloudinary URL for company logo |
| banner_url | text | Nullable | Cloudinary URL for company banner |
| industry | text | Not Null | Industry type |
| founded_date | date | Nullable | Company founding date |
| description | text | Nullable | Company description |
| social_links | jsonb | Nullable | JSON object for social media links |
| created_at | timestamp | Not Null, Default CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | timestamp | Not Null, Default CURRENT_TIMESTAMP | Record update timestamp |

#### Constraints
- Primary Key: `id`
- Foreign Key: `owner_id` references `users(id)`
- Not Null: All address-related fields are required

## Relationships
- One-to-One: Each user can have one company profile (via `owner_id`)
- The `owner_id` in `company_profile` is a foreign key referencing `users(id)`

## Triggers
Automatic timestamp updates are handled by triggers:
- `update_users_updated_at`: Updates `updated_at` in users table on record modification
- `update_company_profile_updated_at`: Updates `updated_at` in company_profile table on record modification

## Sequences
- `users_id_seq`: Auto-increment sequence for users table
- `company_profile_id_seq`: Auto-increment sequence for company_profile table

## Sample Data
The database includes sample data for testing purposes:
- 3 sample users with different genders and verification statuses
- 2 sample companies with complete profile information

## Setup Instructions
1. Create a PostgreSQL database named `company_registration`
2. Run the SQL scripts in the following order:
   - `create_tables.sql` (or individual table scripts)
   - `03_sample_data.sql` (optional, for sample data)
3. The database will automatically create necessary sequences, constraints, and triggers

## Connection Configuration
To connect your application to this database, use the following configuration:
```
Host: localhost
Port: 5432
Database: company_registration
Username: postgres
Password: [your postgres password]
```

Adjust these values according to your PostgreSQL installation.