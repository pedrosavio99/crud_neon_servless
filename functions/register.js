const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { corsHeaders } = require('./middleware/auth');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_1ikY7sPQUauV@ep-raspy-thunder-adwwrdft-pooler.c-2.us-east-1.aws.neon.tech/teste-postgress?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: corsHeaders,
      body: 'Method Not Allowed' 
    };
  }

  try {
    const { name, email, password } = JSON.parse(event.body);

    if (!name || !email || !password) {
      return { 
        statusCode: 400, 
        headers: corsHeaders,
        body: JSON.stringify({ message: "Todos os campos são obrigatórios" }) 
      };
    }

    const client = await pool.connect();

    const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      client.release();
      return { 
        statusCode: 409, 
        headers: corsHeaders,
        body: JSON.stringify({ message: "Email já cadastrado" }) 
      };
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await client.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, password_hash]
    );

    client.release();

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Usuário criado com sucesso!",
        user: result.rows[0]
      })
    };

  } catch (error) {
    console.error(error);
    return { 
      statusCode: 500, 
      headers: corsHeaders,
      body: JSON.stringify({ message: "Erro interno no servidor" }) 
    };
  }
};