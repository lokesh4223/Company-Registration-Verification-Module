const fs = require('fs');
const path = require('path');

// List of required database files to verify
const requiredFiles = [
  'database/create_tables.sql',
  'database/01_company_profile_table.sql',
  'database/02_users_table.sql',
  'database/03_sample_data.sql',
  'database/README.md'
];

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(path.join(__dirname, '..', filePath));
  } catch (err) {
    return false;
  }
}

// Verify all required files
console.log('Verifying database setup files...\n');

let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fileExists(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) {
    allFilesExist = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('✅ All required database setup files are present!');
  console.log('\nDatabase setup is ready for use.');
  console.log('\nNext steps:');
  console.log('1. Create a PostgreSQL database named "company_registration"');
  console.log('2. Run the SQL scripts in order:');
  console.log('   - create_tables.sql (or 01_company_profile_table.sql and 02_users_table.sql)');
  console.log('   - 03_sample_data.sql (optional, for sample data)');
  console.log('3. Update your backend configuration to connect to the database');
} else {
  console.log('❌ Some required database setup files are missing. Please check the implementation.');
}

console.log('='.repeat(50));