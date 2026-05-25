const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui_mude_em_producao";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

const auth = async (event) => {
  // Responder OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Token não fornecido" })
      };
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    return { user: decoded };

  } catch (error) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Token inválido ou expirado" })
    };
  }
};

module.exports = { auth, corsHeaders };