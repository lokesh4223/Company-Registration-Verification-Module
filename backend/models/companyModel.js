const db = require('../config/db');

// Get all companies
const getAllCompanies = async () => {
  const result = await db.query('SELECT * FROM company_profile');
  return result.rows;
};

// Get company by ID
const getCompanyById = async (id) => {
  const result = await db.query('SELECT * FROM company_profile WHERE id = $1', [id]);
  return result.rows[0];
};

// Get company by owner ID
const getCompanyByOwnerId = async (ownerId) => {
  const result = await db.query('SELECT * FROM company_profile WHERE owner_id = $1', [ownerId]);
  return result.rows[0];
};

// Create a new company
const createCompany = async (companyData) => {
  const {
    owner_id,
    company_name,
    address,
    city,
    state,
    country,
    postal_code,
    website,
    logo_url,
    banner_url,
    industry,
    founded_date,
    description,
    social_links
  } = companyData;

  const result = await db.query(
    `INSERT INTO company_profile (
      owner_id, company_name, address, city, state, country, postal_code,
      website, logo_url, banner_url, industry, founded_date, description, social_links
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
    [
      owner_id,
      company_name,
      address || null,
      city,
      state,
      country,
      postal_code,
      website || null,
      logo_url || null,
      banner_url || null,
      industry || null,
      founded_date || null,
      description || null,
      social_links || null
    ]
  );

  return result.rows[0];
};

// Update company by ID
const updateCompany = async (id, companyData) => {
  // Build dynamic query
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(companyData)) {
    // Skip fields that don't exist in the database
    const validFields = [
      'company_name', 'address', 'city', 'state', 'country', 'postal_code',
      'website', 'logo_url', 'banner_url', 'industry', 'founded_date', 
      'description', 'social_links'
    ];
    
    if (validFields.includes(key)) {
      fields.push(`${key} = $${index}`);
      
      // Special handling for social_links to ensure proper JSON format
      if (key === 'social_links' && value !== undefined && value !== null) {
        if (typeof value === 'string') {
          // If it's already a string, try to parse and re-stringify to ensure valid JSON
          try {
            const parsed = JSON.parse(value);
            values.push(JSON.stringify(parsed));
          } catch (e) {
            // If parsing fails, store as is (might be properly formatted already)
            values.push(value);
          }
        } else if (typeof value === 'object') {
          // If it's an object or array, stringify it
          try {
            values.push(JSON.stringify(value));
          } catch (stringifyError) {
            // If stringifying fails, store as null
            values.push(null);
          }
        } else {
          // For other types, convert to string or store as null
          values.push(value !== undefined ? String(value) : null);
        }
      } else {
        values.push(value);
      }
      index++;
    }
  }

  if (fields.length === 0) {
    return await getCompanyById(id);
  }

  values.push(id);
  const query = `UPDATE company_profile SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${index} RETURNING *`;

  try {
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database update error:', error);
    throw error;
  }
};

// Delete company by ID
const deleteCompany = async (id) => {
  const result = await db.query('DELETE FROM company_profile WHERE id = $1 RETURNING *', [id]);
  
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  getCompanyByOwnerId,
  createCompany,
  updateCompany,
  deleteCompany,
};