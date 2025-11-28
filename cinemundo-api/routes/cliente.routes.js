// 📦 Importa controller e configura rotas
module.exports = app => {
    const clientes = require("../controllers/cliente.controller.js");
    const router = require("express").Router();

    // 1️⃣ POST /api/clientes - Cadastrar novo cliente
    router.post("/", clientes.create);

    // 2️⃣ POST /api/clientes/login - Fazer login
    router.post("/login", clientes.login);

    // 3️⃣ GET /api/clientes - Listar todos (debug)
    router.get("/", clientes.listarClientes);

    // 🔗 Registra rotas com prefixo /api/clientes
    app.use('/api/clientes', router);
};