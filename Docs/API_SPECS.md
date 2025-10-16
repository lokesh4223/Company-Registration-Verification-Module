# API Specifications

## Overview
This document outlines the RESTful API endpoints for the Company Registration system, including request/response formats, authentication, and error handling.

## Base URL
```
https://api.company-registration-system.com/v1
```

## Authentication
All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Company Registration

#### Create Company Registration
```
POST /companies
```

**Request Body:**
```json
{
  "companyName": "string",
  "registrationNumber": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string"
  },
  "contact": {
    "email": "string",
    "phone": "string"
  },
  "industry": "string",
  "numberOfEmployees": "integer"
}
```

**Response:**
```json
{
  "id": "string",
  "companyName": "string",
  "registrationNumber": "string",
  "status": "PENDING_VERIFICATION",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Get Company Details
```
GET /companies/{companyId}
```

**Response:**
```json
{
  "id": "string",
  "companyName": "string",
  "registrationNumber": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string"
  },
  "contact": {
    "email": "string",
    "phone": "string"
  },
  "industry": "string",
  "numberOfEmployees": "integer",
  "status": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Update Company Information
```
PUT /companies/{companyId}
```

**Request Body:**
```json
{
  "companyName": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string"
  },
  "contact": {
    "email": "string",
    "phone": "string"
  },
  "industry": "string",
  "numberOfEmployees": "integer"
}
```

**Response:**
```json
{
  "id": "string",
  "companyName": "string",
  "registrationNumber": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string"
  },
  "contact": {
    "email": "string",
    "phone": "string"
  },
  "industry": "string",
  "numberOfEmployees": "integer",
  "status": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Search Companies
```
GET /companies
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Number of items per page (default: 10, max: 100)
- `name` (string): Filter by company name
- `status` (string): Filter by registration status

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "companyName": "string",
      "registrationNumber": "string",
      "status": "string",
      "createdAt": "timestamp"
    }
  ],
  "pagination": {
    "page": "integer",
    "limit": "integer",
    "total": "integer",
    "pages": "integer"
  }
}
```

### User Management

#### Register User
```
POST /users/register
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "createdAt": "timestamp"
}
```

#### Authenticate User
```
POST /auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "expiresIn": "integer"
}
```

## Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

### Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

## Rate Limiting
API requests are rate-limited to prevent abuse:
- 1000 requests per hour per IP address
- 100 requests per minute per authenticated user

## Versioning
The API is versioned using URL path versioning (v1, v2, etc.). Breaking changes will result in a new version.

## Pagination
All list endpoints support pagination using `page` and `limit` query parameters.