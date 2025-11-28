exports.findAll = (req, res) => {
    // Lista hardcoded dos teus 8 filmes para o projeto
    const filmes = [
        { id: 1, titulo: "O Auto da Compadecida 2", imagem: "img/autodacompadecida.jpg" },
        { id: 2, titulo: "Bailarina - John Wick", imagem: "img/bailarinajohn.jpg" },
        { id: 3, titulo: "Ainda Estou Aqui", imagem: "img/aindaestouaqui.jpg" },
        { id: 4, titulo: "Capitão América: Admirável Mundo Novo", imagem: "img/capitaoamerica.jpg" },
        { id: 5, titulo: "A Garota Dinamarquesa", imagem: "img/garotadinarmaquesa.jpg" },
        { id: 6, titulo: "Segundo Tempo", imagem: "img/segundotempo.jpg" },
        { id: 7, titulo: "Sharknado", imagem: "img/skarnado.jpg" },
        { id: 8, titulo: "O Menino e a Garça", imagem: "img/meninoegarca.jpg" } // Adicionei o 8º para fechar a lista
    ];
    res.send(filmes);
};

// Função para gerar horários (como pediste antes)
exports.getHorarios = (req, res) => {
    const lista = [];
    // Gera 5 horários para hoje
    const horarios = ["14:00", "16:30", "19:00", "21:30", "23:00"];
    res.send(horarios);
};