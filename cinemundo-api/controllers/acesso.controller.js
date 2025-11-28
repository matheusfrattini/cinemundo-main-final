const Acesso = require('../cinemundo-api/models/acesso.model');

exports.listarAcessos = async (req, res) => {
  try {
    const acessos = await Acesso.findAll();
    res.json(acessos); 
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.criarAcesso = async (req, res) => {
  try {
    const acesso = await Acesso.create(req.body);
    res.status(201).json(acesso);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};
