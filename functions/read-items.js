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

  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      headers: corsHeaders,
      body: 'Method Not Allowed' 
    };
  }

  try {
    const userId = authResult.user.id;

    const client = await pool.connect();

    const result = await client.query(
      'SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    client.release();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Itens recuperados com sucesso!",
        items: result.rows
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