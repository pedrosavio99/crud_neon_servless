const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_1ikY7sPQUauV@ep-raspy-thunder-adwwrdft-pooler.c-2.us-east-1.aws.neon.tech/teste-postgress?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  try {
    const client = await pool.connect();
    console.log("🔄 Aplicando melhorias nas tabelas...");

    // Índices para melhor performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
      CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);
    `);
    console.log("✅ Índices criados com sucesso!");

    console.log("\n🎉 Todas as tabelas e índices estão configurados!");
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

createTables();