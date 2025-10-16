const bcrypt = require('bcrypt');
const db = require('../config/db');

// Get all users
const getAllUsers = async () => {
  const result = await db.query('SELECT * FROM users');
  return result.rows;
};

// Get user by ID
const getUserById = async (id) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

// Get user by email
const getUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Verify password
const verifyPassword = async (user, password) => {
  console.log('Verifying password for user:', user.email);
  console.log('Plain password length:', password.length);
  console.log('Hashed password length:', user.password.length);
  
  const isValid = await bcrypt.compare(password, user.password);
  console.log('Password verification result:', isValid);
  
  return isValid;
};

// Create a new user
const createUser = async (userData) => {
  const {
    email,
    password,
    full_name,
    signup_type,
    gender,
    mobile_no,
    is_mobile_verified,
    is_email_verified
  } = userData;

  try {
    console.log('Creating user with email:', email);
    console.log('Password length:', password.length);
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('Hashed password length:', hashedPassword.length);

    const result = await db.query(
      `INSERT INTO users (
        email, password, full_name, signup_type, gender, mobile_no, 
        is_mobile_verified, is_email_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        email,
        hashedPassword,
        full_name,
        signup_type || 'e',
        gender,
        mobile_no,
        is_mobile_verified || false,
        is_email_verified || false
      ]
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = result.rows[0];
    console.log('User created successfully:', userWithoutPassword.email);
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user by ID
const updateUser = async (id, userData) => {
  // If password is being updated, hash it
  if (userData.password) {
    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);
  }

  // Build dynamic query
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(userData)) {
    fields.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }

  if (fields.length === 0) {
    return await getUserById(id);
  }

  values.push(id);
  const query = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${index} RETURNING *`;

  const result = await db.query(query, values);
  
  if (result.rows.length === 0) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = result.rows[0];
  return userWithoutPassword;
};

// Delete user by ID
const deleteUser = async (id) => {
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  
  if (result.rows.length === 0) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = result.rows[0];
  return userWithoutPassword;
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  verifyPassword,
  createUser,
  updateUser,
  deleteUser
};