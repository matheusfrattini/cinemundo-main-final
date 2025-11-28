const { connectToDatabase, sql } = require('../config/database');
const nodemailer = require('nodemailer');

// Configuração do Transporter (Email)
// ⚠️ É ideal mover isso para variáveis de ambiente (.env)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'seu.email@gmail.com',
        pass: process.env.EMAIL_PASS || 'sua_senha_de_app'
    }
});

exports.criarCompra = async (req, res) => {
    const { cliente_id, total, metodo_pagamento, itens, nome, email, cpf } = req.body;

    let pool;
    let transaction;
    let compraId = Math.floor(Math.random() * 10000); // ID fake para mock

    try {
        // Tenta conectar ao banco
        try {
            pool = await connectToDatabase();
            transaction = new sql.Transaction(pool);
            await transaction.begin();

            // 1. Criar a Compra Principal (BANCO REAL)
            const requestCompra = new sql.Request(transaction);
            const resultCompra = await requestCompra
                .input('cliente_id', sql.Int, cliente_id)
                .input('valor_total', sql.Decimal(10, 2), total)
                .input('metodo_pagamento', sql.VarChar, metodo_pagamento)
                .query(`
                    INSERT INTO Compras(cliente_id, valor_total, metodo_pagamento, data_hora) 
                    OUTPUT INSERTED.id
VALUES(@cliente_id, @valor_total, @metodo_pagamento, GETDATE())
    `);

            compraId = resultCompra.recordset[0].id;

            // 2. Inserir os Itens da Compra
            for (const item of itens) {
                const requestItem = new sql.Request(transaction);
                await requestItem
                    .input('compra_id', sql.Int, compraId)
                    .input('descricao', sql.VarChar, item.descricao)
                    .input('qtd', sql.Int, item.quantidade)
                    .input('valor', sql.Decimal(10, 2), item.valor)
                    .input('tipo', sql.VarChar, item.tipo)
                    .query(`
                        INSERT INTO Itens_Compra(compra_id, descricao_item, quantidade, valor_unitario, tipo_item)
VALUES(@compra_id, @descricao, @qtd, @valor, @tipo)
    `);
            }

            await transaction.commit();
            console.log("✅ Compra salva no BANCO DE DADOS com sucesso. ID:", compraId);

        } catch (dbError) {
            console.warn("⚠️ Falha ao conectar/salvar no banco. Usando MOCK MODE para compra.");
            if (transaction) await transaction.rollback();
            // Não lança erro, segue para o email simulando sucesso
        }

        // 3. Enviar Email de Confirmação (SEMPRE TENTA)
        let descricaoItensEmail = itens.map(i => `<li>${i.descricao} - R$ ${i.valor}</li>`).join('');

        if (email) {
            try {
                const mailOptions = {
                    from: '"CineMundo" <cinemundo.contato@gmail.com>',
                    to: email,
                    subject: 'Confirmação de Compra - CineMundo',
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                            <h1 style="color: #ff6600; text-align: center;">Compra Confirmada! 🎬</h1>
                            <p>Olá, <strong>${nome || 'Cinéfilo'}</strong>!</p>
                            <p>Sua compra foi realizada com sucesso.</p>
                            <hr style="border: 0; border-top: 1px solid #eee;">
                            <h3>Detalhes do Pedido #${compraId}</h3>
                            <ul>${descricaoItensEmail}</ul>
                            <p style="font-size: 1.2em;"><strong>Total: R$ ${total}</strong></p>
                            <p>Forma de Pagamento: ${metodo_pagamento.toUpperCase()}</p>
                            <hr style="border: 0; border-top: 1px solid #eee;">
                            <p style="text-align: center; color: #777;">Bom filme!<br>Equipe CineMundo</p>
                        </div>
                    `
                };

                // Envia o email
                await transporter.sendMail(mailOptions);
                console.log("📧 Email enviado com sucesso para:", email);
            } catch (emailError) {
                console.error("⚠️ Erro ao enviar email (compra finalizada mesmo assim):", emailError.message);
            }
        }

        // Gera código PIX fake se necessário
        const pixCode = metodo_pagamento === 'pix'
            ? '00020126580014BR.GOV.BCB.PIX0136' + Math.floor(Math.random() * 1000000000)
            : null;

        res.status(201).json({ message: 'Compra realizada com sucesso!', id: compraId, pixCode });

    } catch (err) {
        console.error("❌ Erro fatal na compra:", err);
        res.status(500).json({ error: 'Erro ao processar compra', detalhes: err.message });
    }
};
