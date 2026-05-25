const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_1ikY7sPQUauV@ep-raspy-thunder-adwwrdft-pooler.c-2.us-east-1.aws.neon.tech/teste-postgress?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Conexão com Neon realizada com sucesso!");
    
    const result = await client.query('SELECT NOW()');
    console.log("🕒 Hora do servidor:", result.rows[0].now);
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error("❌ Erro na conexão:", error.message);
  }
}

testConnection();