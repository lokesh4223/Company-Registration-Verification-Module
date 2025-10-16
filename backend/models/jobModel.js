const db = require('../config/db');

// Create a new job
const createJob = async (jobData) => {
  const {
    company_id,
    title,
    department,
    location,
    employment_type,
    experience_level,
    salary_min,
    salary_max,
    description,
    requirements,
    responsibilities,
    skills,
    is_remote,
    is_urgent
  } = jobData;

  const result = await db.query(
    `INSERT INTO jobs (
      company_id, title, department, location, employment_type, experience_level,
      salary_min, salary_max, description, requirements, responsibilities, skills,
      is_remote, is_urgent
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
    RETURNING *`,
    [
      company_id,
      title,
      department || null,
      location,
      employment_type,
      experience_level || null,
      salary_min || null,
      salary_max || null,
      description,
      requirements || null,
      responsibilities || null,
      skills ? JSON.stringify(skills) : null,
      is_remote || false,
      is_urgent || false
    ]
  );

  return result.rows[0];
};

// Get all jobs for a company
const getJobsByCompanyId = async (companyId) => {
  const result = await db.query(
    'SELECT * FROM jobs WHERE company_id = $1 ORDER BY created_at DESC',
    [companyId]
  );
  return result.rows;
};

// Get job by ID
const getJobById = async (id) => {
  const result = await db.query('SELECT * FROM jobs WHERE id = $1', [id]);
  return result.rows[0];
};

// Update job by ID
const updateJob = async (id, jobData) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(jobData)) {
    // Skip fields that don't exist in the database
    const validFields = [
      'title', 'department', 'location', 'employment_type', 'experience_level',
      'salary_min', 'salary_max', 'description', 'requirements', 'responsibilities',
      'skills', 'is_remote', 'is_urgent', 'status', 'applicants_count'
    ];
    
    if (validFields.includes(key)) {
      fields.push(`${key} = $${index}`);
      
      // Special handling for skills to ensure proper JSON format
      if (key === 'skills' && value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          values.push(JSON.stringify(value));
        } else if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            values.push(JSON.stringify(parsed));
          } catch (e) {
            values.push(value);
          }
        } else {
          values.push(JSON.stringify(value));
        }
      } else {
        values.push(value);
      }
      index++;
    }
  }

  if (fields.length === 0) {
    return await getJobById(id);
  }

  values.push(id);
  const query = `UPDATE jobs SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${index} RETURNING *`;

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

// Delete job by ID
const deleteJob = async (id) => {
  const result = await db.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [id]);
  
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

// Get jobs with filters for dashboard/overview
const getJobsForDashboard = async (companyId, limit = 5) => {
  const result = await db.query(
    'SELECT * FROM jobs WHERE company_id = $1 ORDER BY created_at DESC LIMIT $2',
    [companyId, limit]
  );
  return result.rows;
};

// Update job status
const updateJobStatus = async (id, status) => {
  const result = await db.query(
    'UPDATE jobs SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};

// Increment applicants count
const incrementApplicantsCount = async (id) => {
  const result = await db.query(
    'UPDATE jobs SET applicants_count = applicants_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createJob,
  getJobsByCompanyId,
  getJobById,
  updateJob,
  deleteJob,
  getJobsForDashboard,
  updateJobStatus,
  incrementApplicantsCount
};