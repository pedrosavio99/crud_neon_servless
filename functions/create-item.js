const { Pool } = require('pg');
const { corsHeaders, auth } = require('./middleware/auth');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_1ikY7sPQUauV@ep-raspy-thunder-adwwrdft-pooler.c-2.us-east-1.aws.neon.tech/teste-postgress?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders };
  }

  const authResult = await auth(event);
  if (authResult.statusCode) return authResult;

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: corsHeaders,
      body: 'Method Not Allowed' 
    };
  }

  try {
    const { title, description } = JSON.parse(event.body);
    const userId = authResult.user.id;

    if (!title) {
      return { 
        statusCode: 400, 
        headers: corsHeaders,
        body: JSON.stringify({ message: "Título é obrigatório" }) 
      };
    }

    const client = await pool.connect();

    const result = await client.query(
      'INSERT INTO items (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, userId]
    );

    client.release();

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Item criado com sucesso!",
        item: result.rows[0]
      })
    };

  } catch (error) {
    console.error(error);
    return { 
      statusCode: 500, 
      headers: corsHeaders,
      body: JSON.stringify({ message: "Erro interno" }) 
    };
  }
};