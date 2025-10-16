const db = require('../config/db');

// Create jobs table
const createJobsTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        company_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(100),
        location VARCHAR(255) NOT NULL,
        employment_type VARCHAR(50) NOT NULL,
        experience_level VARCHAR(50),
        salary_min INTEGER,
        salary_max INTEGER,
        description TEXT NOT NULL,
        requirements TEXT,
        responsibilities TEXT,
        skills JSONB,
        is_remote BOOLEAN DEFAULT false,
        is_urgent BOOLEAN DEFAULT false,
        status VARCHAR(20) DEFAULT 'pending',
        applicants_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES company_profile(id) ON DELETE CASCADE
      )
    `;
    
    await db.query(query);
    console.log('Jobs table created successfully');
    
    // Create indexes for better performance
    await db.query('CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON jobs(employment_type)');
    
    console.log('Jobs table indexes created successfully');
  } catch (error) {
    console.error('Error creating jobs table:', error);
    throw error;
  }
};

// Add a function to update the updated_at timestamp
const createJobsTrigger = async () => {
  try {
    // Create function to update updated_at
    await db.query(`
      CREATE OR REPLACE FUNCTION update_jobs_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    
    // Create trigger
    await db.query(`
      DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
      CREATE TRIGGER update_jobs_updated_at
      BEFORE UPDATE ON jobs
      FOR EACH ROW
      EXECUTE FUNCTION update_jobs_updated_at();
    `);
    
    console.log('Jobs table trigger created successfully');
  } catch (error) {
    console.error('Error creating jobs trigger:', error);
    throw error;
  }
};

module.exports = {
  createJobsTable,
  createJobsTrigger
};