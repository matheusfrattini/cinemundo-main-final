const Genero = require('../cinemundo-api/models/genero.model');

exports.listarGeneros = async (req, res) => {
  try {
    const generos = await Genero.findAll();
    res.json(generos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}; 

exports.criarGenero = async (req, res) => {
  try {
    const genero = await Genero.create(req.body);
    res.status(201).json(genero);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};
