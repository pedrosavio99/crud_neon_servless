const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { corsHeaders } = require('./middleware/auth');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_1ikY7sPQUauV@ep-raspy-thunder-adwwrdft-pooler.c-2.us-east-1.aws.neon.tech/teste-postgress?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui_mude_em_producao";

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
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return { 
        statusCode: 400, 
        headers: corsHeaders,
        body: JSON.stringify({ message: "Email e senha são obrigatórios" }) 
      };
    }

    const client = await pool.connect();

    const result = await client.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    client.release();

    if (result.rows.length === 0) {
      return { 
        statusCode: 401, 
        headers: corsHeaders,
        body: JSON.stringify({ message: "Credenciais inválidas" }) 
      };
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return { 
        statusCode: 401, 
        headers: corsHeaders,
        body: JSON.stringify({ message: "Credenciais inválidas" }) 
      };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Login realizado com sucesso!",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
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