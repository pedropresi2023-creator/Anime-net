const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const USERS_FILE = './usuarios.json';
const ANIMES_FILE = './animes.json';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helpers para ler arquivos
const getUsers = () => {
    if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(USERS_FILE));
};

const getAnimes = () => {
    if (!fs.existsSync(ANIMES_FILE)) return {};
    return JSON.parse(fs.readFileSync(ANIMES_FILE, 'utf8'));
};

// --- LOGIN E CADASTRO ---
app.post('/register', (req, res) => {
    const { user, pass } = req.body;
    const users = getUsers();
    if (users.find(u => u.user === user)) return res.status(400).send('Usuário já existe!');
    users.push({ user, pass });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.status(201).send('Cadastrado');
});

app.post('/login', (req, res) => {
    const { user, pass } = req.body;
    const users = getUsers();
    const foundUser = users.find(u => u.user === user && u.pass === pass);
    if (foundUser || (user === 'admin' && pass === '1234')) res.status(200).send('OK');
    else res.status(401).send('Erro');
});

// --- API DE ANIMES (GOOGLE DRIVE) ---
app.get('/api/info/:anime', (req, res) => {
    const anime = req.params.anime;
    const animes = getAnimes();
    const total = animes[anime] ? animes[anime].length : 0;
    res.json({ total });
});

app.get('/api/video-url/:anime/:ep', (req, res) => {
    const { anime, ep } = req.params;
    const animes = getAnimes();
    const index = parseInt(ep) - 1;
    const id = animes[anime] ? animes[anime][index] : null;

    if (id) {
        res.json({ url: `https://drive.google.com/file/d/${id}/preview` });
    } else {
        res.status(404).json({ error: "Não encontrado" });
    }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}/login.html`));