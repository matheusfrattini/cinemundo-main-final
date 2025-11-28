// 📦 Importa biblioteca mssql para conexão com SQL Server
const sql = require('mssql');
require('dotenv').config();

// 1️⃣ CONFIGURAÇÃO DE CONEXÃO
// 1️⃣ CONFIGURAÇÃO DE CONEXÃO
const config = {
    user: process.env.DB_USER || 'BD24477',
    password: process.env.DB_PASSWORD || 'Frattini2001@2024',
    server: process.env.DB_HOST || 'regulus.cotuca.unicamp.br',
    database: process.env.DB_NAME || 'CINEMUNDO',
    
    options: {
        encrypt: true,
        trustServerCertificate: true, 
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000
    },
    
    port: parseInt(process.env.DB_PORT) || 1433
};

// 2️⃣ FUNÇÃO DE CONEXÃO
async function connectToDatabase() {
    try {
        const pool = await sql.connect(config);
        console.log("✅ Conectado ao SQL Server com sucesso!");
        return pool;
    } catch (err) {
        console.error("❌ Erro ao conectar ao SQL Server:", err.message);
        throw err;
    }
}

// 3️⃣ EXPORTAÇÃO
module.exports = {
    sql,
    connectToDatabase
};