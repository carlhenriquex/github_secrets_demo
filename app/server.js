const express = require("express");

const app = express();
const PORT = 3000;

const mensagem = process.env.MENSAGEM_SECRETA;

app.get("/", (req, res) => {
    res.send(`
        <h1>GitHub Secrets</h1>
        <p>Mensagem: ${mensagem}</p>
    `);
});

app.listen(PORT, () => {
    console.log(`Servidor executando na porta ${PORT}`);
});