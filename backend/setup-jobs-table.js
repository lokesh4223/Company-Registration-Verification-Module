const { createJobsTable, createJobsTrigger } = require('./migrations/create_jobs_table');

const setupJobsTable = async () => {
  try {
    console.log('Setting up jobs table...');
    
    // Create jobs table
    await createJobsTable();
    
    // Create jobs trigger
    await createJobsTrigger();
    
    console.log('Jobs table setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to set up jobs table:', error);
    process.exit(1);
  }
};

// Run the setup if this file is executed directly
if (require.main === module) {
  setupJobsTable();
}

module.exports = setupJobsTable;