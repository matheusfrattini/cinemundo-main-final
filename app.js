const express = require('express');
const cors = require('cors');
const path = require('path'); // 1. Importar o módulo 'path'
const app = express();
const sequelize = require('./config/database');

app.use(cors());
app.use(express.json());

// ==========================================================
// 2. CONFIGURAÇÃO DA PASTA FRONT-END (CORREÇÃO AQUI) 📂
// ==========================================================
// Diz ao servidor que os ficheiros do site estão na pasta "cinemundo-front"
// O '../cinemundo-front' assume que as pastas 'cinemundo-api' e 'cinemundo-front' estão lado a lado.
app.use(express.static(path.join(__dirname, '../cinemundo-front')));

// Rotas da API
const clienteRoutes = require('./routes/cliente.routes');
app.use('/api/clientes', clienteRoutes);

// Conectar com o banco
sequelize.authenticate()
  .then(() => console.log('Conectado ao banco SQL Server ✅'))
  .catch((err) => console.error('Erro na conexão com o banco ❌', err));

module.exports = app;