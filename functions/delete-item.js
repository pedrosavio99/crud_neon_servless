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

  if (event.httpMethod !== 'DELETE') {
    return { 
      statusCode: 405, 
      headers: corsHeaders,
      body: 'Method Not Allowed' 
    };
  }

  try {
    const { id } = JSON.parse(event.body);
    const userId = authResult.user.id;

    if (!id) {
      return { 
        statusCode: 400, 
        headers: corsHeaders,
        body: JSON.stringify({ message: "ID do item é obrigatório" }) 
      };
    }

    const client = await pool.connect();

    const result = await client.query(
      'DELETE FROM items WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    client.release();

    if (result.rows.length === 0) {
      return { 
        statusCode: 404, 
        headers: corsHeaders,
        body: JSON.stringify({ message: "Item não encontrado ou não pertence ao usuário" }) 
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Item deletado com sucesso!",
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