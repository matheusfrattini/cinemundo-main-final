// 📦 Importa modelo de cliente (SQL Server ou Mock)
const Cliente = require('../models/cliente.model');
const ClienteMock = require('../models/cliente.model.mock');

// 🔄 Flag para determinar se usa banco real ou mock
let useMock = false;

// 1️⃣ CREATE - Cadastrar novo cliente
exports.create = (req, res) => {
    const { nome, email, senha } = req.body;

    // Validação
    if (!nome || !email || !senha) {
        return res.status(400).send({ message: 'Todos os campos são obrigatórios!' });
    }

    const novoCliente = { nome, email, senha };
    const model = useMock ? ClienteMock : Cliente;

    model.create(novoCliente, (err, data) => {
        if (err) {
            console.error("❌ Erro no cadastro:", err);
            res.status(500).send({
                message: err.message || 'Erro ao criar cliente.'
            });
        } else {
            console.log(`✅ Cliente cadastrado: ${data.nome} (${useMock ? 'MOCK' : 'DB'})`);
            res.status(201).json({
                message: 'Cliente cadastrado com sucesso!',
                id: data.id
            });
        }
    });
};

// 2️⃣ LOGIN - Validar credenciais
exports.login = (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send({ message: 'Email e senha são obrigatórios!' });
    }

    const model = useMock ? ClienteMock : Cliente;

    model.findByEmailAndPassword(email, senha, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: 'Usuário não encontrado ou senha incorreta.' });
            } else {
                res.status(500).send({ message: 'Erro ao processar login.' });
            }
        } else {
            console.log(`✅ Login: ${data.nome} (${useMock ? 'MOCK' : 'DB'})`);
            res.status(200).json({
                message: 'Login realizado com sucesso!',
                nome: data.nome,
                email: data.email,
                id: data.id
            });
        }
    });
};

// 3️⃣ LISTAR - Todos os clientes (debug)
exports.listarClientes = (req, res) => {
    const model = useMock ? ClienteMock : Cliente;

    model.findAll((err, data) => {
        if (err) {
            res.status(500).send({ message: 'Erro ao listar clientes.' });
        } else {
            res.json(data);
        }
    });
};

// 4️⃣ CONFIGURAR - Modo de operação
exports.setUseMock = (value) => {
    useMock = value;
    console.log(`🔄 Modo alterado: ${useMock ? 'MOCK (sem banco)' : 'DATABASE (banco real)'}`);
};