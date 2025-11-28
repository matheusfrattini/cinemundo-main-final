// 💾 Mock de dados de clientes (armazenamento temporário em memória)
// 🎯 Usado quando o banco de dados não está disponível

let clientes = [
    {
        id: 1,
        nome: 'Usuario Teste',
        email: 'teste@cinemundo.com',
        senha: '12345',
        cpf: '000.000.000-00'
    }
];

let nextId = 2;

// 1️⃣ CREATE - Cadastrar novo cliente
const create = (newCliente, result) => {
    // Verifica se email já existe
    const emailExists = clientes.find(c => c.email === newCliente.email);
    if (emailExists) {
        result({ message: 'Email já cadastrado' }, null);
        return;
    }
    
    const cliente = {
        id: nextId++,
        ...newCliente
    };
    
    clientes.push(cliente);
    console.log('✅ Cliente criado (mock):', cliente);
    result(null, cliente);
};

// 2️⃣ LOGIN - Buscar por email e senha
const findByEmailAndPassword = (email, senha, result) => {
    const cliente = clientes.find(c => c.email === email && c.senha === senha);
    
    if (cliente) {
        console.log('✅ Cliente encontrado (mock):', cliente.nome);
        result(null, cliente);
    } else {
        result({ kind: 'not_found' }, null);
    }
};

// 3️⃣ LIST - Listar todos (para debug)
const findAll = (result) => {
    result(null, clientes);
};

module.exports = {
    create,
    findByEmailAndPassword,
    findAll
};
