const db = require('./config/db');

async function migrateRemoveMobile() {
  try {
    console.log('Starting migration to remove mobile number fields...');
    
    // Remove the unique_mobile_no constraint first
    try {
      await db.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS unique_mobile_no');
      console.log('Dropped unique_mobile_no constraint');
    } catch (error) {
      console.log('unique_mobile_no constraint not found or already dropped');
    }
    
    // Remove the users_mobile_no_not_null constraint
    try {
      await db.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_mobile_no_not_null');
      console.log('Dropped users_mobile_no_not_null constraint');
    } catch (error) {
      console.log('users_mobile_no_not_null constraint not found or already dropped');
    }
    
    // Remove the valid_mobile_format constraint
    try {
      await db.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS valid_mobile_format');
      console.log('Dropped valid_mobile_format constraint');
    } catch (error) {
      console.log('valid_mobile_format constraint not found or already dropped');
    }
    
    // Drop the mobile_no column
    try {
      await db.query('ALTER TABLE users DROP COLUMN IF EXISTS mobile_no');
      console.log('Dropped mobile_no column');
    } catch (error) {
      console.log('mobile_no column not found or already dropped');
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration error:', error.message);
  } finally {
    process.exit(0);
  }
}

migrateRemoveMobile();