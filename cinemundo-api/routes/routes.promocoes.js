const express = require('express');
const router = express.Router();
const promocaoController = require('../controllers/promocao.controller');

router.get('/', promocaoController.listarPromocoes);

module.exports = router;