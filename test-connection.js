// Script de teste de conexão com o banco de dados
const { connectToDatabase, sql } = require('./config/database');

async function testConnection() {
    console.log('\n🔍 Testando conexão com o banco de dados...\n');
    
    try {
        // Tenta conectar
        const pool = await connectToDatabase();
        
        // Testa uma query simples
        console.log('📊 Executando query de teste...');
        const result = await pool.request().query('SELECT DB_NAME() AS DatabaseName, GETDATE() AS ServerTime');
        
        console.log('\n✅ CONEXÃO ESTABELECIDA COM SUCESSO!');
        console.log('📌 Banco de dados:', result.recordset[0].DatabaseName);
        console.log('⏰ Hora do servidor:', result.recordset[0].ServerTime);
        
        // Verifica se as tabelas existem
        console.log('\n🔎 Verificando tabelas existentes...\n');
        const tables = await pool.request().query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE' 
            ORDER BY TABLE_NAME
        `);
        
        if (tables.recordset.length > 0) {
            console.log('📋 Tabelas encontradas:');
            tables.recordset.forEach(table => {
                console.log(`   ✓ ${table.TABLE_NAME}`);
            });
        } else {
            console.log('⚠️  Nenhuma tabela encontrada no banco de dados.');
            console.log('💡 Você precisa executar o script database.sql primeiro.');
        }
        
        // Fecha a conexão
        await pool.close();
        console.log('\n🔌 Conexão fechada com sucesso.\n');
        process.exit(0);
        
    } catch (err) {
        console.error('\n❌ ERRO AO CONECTAR:', err.message);
        console.error('\n📝 Detalhes do erro:', err);
        process.exit(1);
    }
}

// Executa o teste
testConnection();
