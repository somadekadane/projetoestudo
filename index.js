const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// Carregar os middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

// Conexão com o servidor DB
const urlDB = "mongodb+srv://senac:123senac@projetonode.d0d37.mongodb.net/banco?retryWrites=true&w=majority&appName=ProjetoNode";
mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado ao banco de dados"))
    .catch((err) => console.log("Erro ao conectar com o banco de dados:", err));


// Definir o modelo Cliente
const schema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    cpf: { type: String, unique: true, required: true },
    telefone: { type: String, unique: true, required: true },
    idade: { type: Number, min: 16, max: 120 },
    usuario: { type: String, unique: true },
    senha: { type: String },
    datacadastro: { type: Date, default: Date.now }
    // Adicione outros campos conforme necessário
});

const Cliente = mongoose.model('Cliente',schema);

// Rota GET para listar todos os clientes
app.get("/", (req, res) => {
    Cliente.find()
        .then((result) => {
            res.status(200).send({ dados: result });
        })
        .catch((error) => {
            res.status(500).send({ erro: error.message });
        });
});

// Rota GET para teste
app.get("/projeto/teste", (req, res) => {
    res.send("Você está em outro servidor");
});

// Rota POST para inserir um novo cliente
app.post("/inserir", (req, res) => {
    const rs = new Cliente(req.body);

    rs.save()
        .then((result) => {
            res.status(201).send({ msg: "Cliente cadastrado com sucesso", cliente: result });
        })
        .catch((error) => {
            res.status(500).send({ msg: "Erro ao cadastrar cliente", erro: error.message });
        });
});

// Rota PUT para atualizar um cliente
app.put("/atualizar", (req, res) => {
    const { _id, nome, email } = req.body;

    Cliente.findByIdAndUpdate(_id, { nome, email }, { new: true })
        .then((result) => {
            if (!result) {
                return res.status(404).send({ msg: "Cliente não encontrado" });
            }
            res.status(200).send({ msg: "Cliente atualizado", cliente: result });
        })
        .catch((error) => {
            res.status(500).send({ msg: "Erro ao atualizar cliente", erro: error.message });
        });
});

// Rota DELETE para apagar um cliente
app.delete("/apagar", (req, res) => {
    const { _id } = req.body;

    Cliente.findByIdAndDelete(_id)
        .then((result) => {
            if (!result) {
                return res.status(404).send({ msg: "Cliente não encontrado" });
            }
            res.status(200).send({ msg: "Cliente apagado", cliente: result });
        })
        .catch((error) => {
            res.status(500).send({ msg: "Erro ao apagar cliente", erro: error.message });
        });
});

// Configurações do servidor
app.listen(5000, () => console.log("Servidor online em http://127.0.0.1:5000"));
