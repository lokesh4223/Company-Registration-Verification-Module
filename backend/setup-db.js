const { Client } = require('pg');
require('dotenv').config();

// Default PostgreSQL connection (without specifying our database)
const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // Connect to default database
  user: 'postgres',
  password: 'postgres', // Default PostgreSQL password
});

async function setupDatabase() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'company_registration';
    const dbUser = process.env.DB_USER || 'postgres';
    const dbPassword = process.env.DB_PASSWORD || 'postgres';
    
    // Check if database exists
    const dbExists = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
    
    if (dbExists.rowCount === 0) {
      console.log(`Creating database ${dbName}`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
    
    await client.end();
    console.log('Database setup completed');
  } catch (error) {
    console.error('Database setup error:', error.message);
    await client.end();
  }
}

setupDatabase();