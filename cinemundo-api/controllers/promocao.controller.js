const { connectToDatabase } = require('../config/database');

exports.listarPromocoes = async (req, res) => {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request().query('SELECT * FROM Promocoes');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar promoções' });
    }
};