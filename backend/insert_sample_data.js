const userModel = require('./models/userModel');
const companyModel = require('./models/companyModel');

async function insertSampleData() {
  try {
    console.log('Inserting sample data...');
    
    // Create a sample user
    const userData = {
      email: 'sample@example.com',
      password: 'password123',
      full_name: 'Sample User',
      signup_type: 'e',
      gender: 'm',
      mobile_no: '+1234567890',
      is_mobile_verified: true,
      is_email_verified: true
    };
    
    console.log('Creating user...');
    const user = await userModel.createUser(userData);
    console.log('User created:', user);
    
    // Create a sample company
    const companyData = {
      owner_id: user.id,
      company_name: 'Sample Company Inc.',
      address: '123 Business Street',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postal_code: '10001',
      website: 'https://samplecompany.com',
      industry: 'Technology',
      description: 'A sample company for demonstration purposes'
    };
    
    console.log('Creating company...');
    const company = await companyModel.createCompany(companyData);
    console.log('Company created:', company);
    
    console.log('Sample data inserted successfully!');
    
  } catch (error) {
    console.error('Error inserting sample data:', error.message);
  }
}

insertSampleData();