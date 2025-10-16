const { Pool } = require('pg');
require('dotenv').config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'company_registration',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'loki@143',
});

async function createTables() {
  try {
    // Connect to database
    const client = await pool.connect();
    console.log('Connected to database');
    
    // Drop existing tables if they exist
    console.log('Dropping existing tables...');
    await client.query('DROP TABLE IF EXISTS company_profile CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    
    // Create users table
    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        signup_type VARCHAR(1) NOT NULL DEFAULT 'e',
        gender VARCHAR(1) NOT NULL CHECK (gender IN ('m', 'f', 'o')),
        mobile_no VARCHAR(20) UNIQUE,
        is_mobile_verified BOOLEAN DEFAULT false,
        is_email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create company_profile table
    console.log('Creating company_profile table...');
    await client.query(`
      CREATE TABLE company_profile (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        company_name TEXT NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(50) NOT NULL,
        state VARCHAR(50) NOT NULL,
        country VARCHAR(50) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        website TEXT,
        logo_url TEXT,
        banner_url TEXT,
        industry TEXT NOT NULL,
        founded_date DATE,
        description TEXT,
        social_links JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes
    console.log('Creating indexes...');
    await client.query(`
      CREATE INDEX idx_users_email ON users(email)
    `);
    
    await client.query(`
      CREATE INDEX idx_company_profile_owner_id ON company_profile(owner_id)
    `);
    
    // Create function and trigger for updating updated_at timestamp
    console.log('Creating update timestamp function and triggers...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
         NEW.updated_at = NOW();
         RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
    
    // Create triggers for both tables
    await client.query(`
      CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON users 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column()
    `);
    
    await client.query(`
      CREATE TRIGGER update_company_profile_updated_at 
      BEFORE UPDATE ON company_profile 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column()
    `);
    
    client.release();
    console.log('Tables created successfully!');
    
  } catch (error) {
    console.error('Error creating tables:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

createTables();