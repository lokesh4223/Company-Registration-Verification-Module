# Profile Components Documentation

## Overview
This document describes the implementation of user and company profile components in the Company Registration system. The profile system consists of two main components: UserProfile for user-specific information and EmployersProfile for company-specific information.

## Components

### UserProfile Component
Located at: `frontend/src/components/dashboard/UserProfile.jsx`

#### Features
- Displays user personal information (full name, email, mobile number, gender)
- Provides edit functionality to update user details
- Shows account information (account status, member since, last updated)
- Uses data from Redux store and API

#### Data Sources
- User data from Redux store (`state.user.user`)
- API endpoints: `/api/users/profile` (GET, PUT)

#### Fields Displayed
1. **Personal Information**
   - Full Name
   - Email Address
   - Mobile Number
   - Gender

2. **Account Information**
   - Account Status
   - Member Since
   - Last Updated

### EmployersProfile Component
Located at: `frontend/src/components/dashboard/EmployersProfile.jsx`

#### Features
- Displays company information (name, industry, founded date, etc.)
- Shows contact information (address, phone, email, map location)
- Displays employee statistics and department information
- Provides edit functionality to update company details
- Fetches real data from the company_profile table

#### Data Sources
- API endpoints: `/api/companies/profile` (GET, PUT)
- Database table: `company_profile`

#### Fields Displayed
1. **Company Information**
   - Company Name
   - Industry
   - Founded Date
   - Location
   - Website
   - Description
   - Logo

2. **Contact Information**
   - Phone Number
   - Email Address
   - Map Location
   - Full Address (Address, City, State, Country, Postal Code)

3. **Employee Statistics**
   - Total Employees
   - Department Breakdown
   - Visual representation of department sizes

4. **Departments**
   - List of departments with employee counts

## API Endpoints

### User Profile Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change user password

### Company Profile Endpoints
- `GET /api/companies/profile` - Get company profile
- `PUT /api/companies/profile` - Update company profile
- `POST /api/companies/upload-logo` - Upload company logo
- `POST /api/companies/upload-banner` - Upload company banner

## Database Schema

### Users Table
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
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Company Profile Table
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
    phone character varying(20),
    contact_email character varying(255),
    map_location text,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Implementation Details

### Data Fetching
Both components fetch data on mount:
- UserProfile uses data from Redux store
- EmployersProfile fetches data from API endpoint

### Editing
Both components provide edit functionality:
- Toggle between view and edit modes
- Form validation for required fields
- Loading states during API calls
- Success/error notifications using toast

### Error Handling
- Loading indicators during data fetch
- Error messages for failed API calls
- Fallback to default/empty values when data is missing

## Integration with Onboarding

The profile data is initially populated during the onboarding process:
1. Company Info step - Populates basic company information
2. Founding Info step - Populates founding details
3. Social Media Profile step - Populates social links
4. Contact Info step - Populates contact information

## Testing

To test the profile components:

1. Complete the onboarding process
2. Navigate to the dashboard
3. Click on "User Profile" or "Company Profile" in the sidebar
4. Verify that the profile information is displayed correctly
5. Click "Edit Profile" to modify information
6. Save changes and verify they are persisted

## Future Enhancements

Planned improvements:
- Add profile picture upload for users
- Implement password change functionality
- Add two-factor authentication settings
- Include audit log of profile changes
- Add export functionality for profile data