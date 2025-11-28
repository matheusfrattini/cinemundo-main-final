// 📦 Importa configuração do banco SQL Server
const { connectToDatabase, sql } = require("../config/database.js");

// 🏗️ Construtor do modelo Cliente
const Cliente = function(cliente) {
  this.email = cliente.email;
  this.senha = cliente.senha;
  this.nome = cliente.nome;
  this.cpf = cliente.cpf;
};

// 1️⃣ CREATE - Inserir novo cliente no banco
Cliente.create = async (newCliente, result) => {
  try {
    const pool = await connectToDatabase();
    const request = pool.request();
    
    request.input('Nome_Completo', sql.NVarChar, newCliente.nome);
    request.input('Email', sql.NVarChar, newCliente.email);
    request.input('Senha', sql.NVarChar, newCliente.senha);
    request.input('CPF', sql.VarChar, newCliente.cpf || null);

    const query = `
      INSERT INTO UsuariosINT (Nome_Completo, Email, Senha, CPF, Data_Cadastro)
      OUTPUT INSERTED.ID
      VALUES (@Nome_Completo, @Email, @Senha, @CPF, GETDATE())
    `;

    const res = await request.query(query);
    
    console.log("✅ Cliente criado: ", { id: res.recordset[0].ID, ...newCliente });
    result(null, { id: res.recordset[0].ID, ...newCliente });

  } catch (err) {
    console.log("❌ Erro ao criar: ", err);
    result(err, null);
  }
};

// 2️⃣ READ - Buscar cliente por email e senha (login)
Cliente.findByEmailAndPassword = async (email, senha, result) => {
  try {
    const pool = await connectToDatabase();
    const request = pool.request();

    request.input('Email', sql.NVarChar, email);
    request.input('Senha', sql.NVarChar, senha);

    const query = `SELECT * FROM UsuariosINT WHERE Email = @Email AND Senha = @Senha`;
    
    const res = await request.query(query);

    if (res.recordset.length) {
      const cliente = res.recordset[0];
      // Mapear campos do banco para o objeto esperado (se necessário)
      const clienteFormatado = {
          id: cliente.ID,
          nome: cliente.Nome_Completo,
          email: cliente.Email,
          cpf: cliente.CPF
      };

      console.log("✅ Cliente encontrado: ", clienteFormatado);
      result(null, clienteFormatado);
      return;
    }

    result({ kind: "not_found" }, null);

  } catch (err) {
    console.log("❌ Erro: ", err);
    result(err, null);
  }
};

module.exports = Cliente;