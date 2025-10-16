const { createJobsTable, createJobsTrigger } = require('./create_jobs_table');

const runMigrations = async () => {
  try {
    console.log('Running migrations...');
    
    // Create jobs table
    await createJobsTable();
    
    // Create jobs trigger
    await createJobsTrigger();
    
    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();