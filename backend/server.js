// =========================================================
// SYNTAX.lab — BACK-END
//
// - Abre os arquivos HTML e CSS do seu site.
// - Salva os dados da tela de entrada na tabela usuarios.
// - Mantém cadastro e login de técnicos separados.
// - Usa o banco.db localizado na pasta deste server.js.
// - Não apaga as tabelas nem os registros existentes.
// =========================================================

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));

// Caminho fixo para evitar abrir outro banco por engano.
const caminhoBanco = path.join(__dirname, 'banco.db');

const db = new sqlite3.Database(caminhoBanco);

// =========================================================
// FUNÇÕES DO BANCO
// =========================================================

// Consulta várias linhas.
function consultar(sql, parametros = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, parametros, (erro, linhas) => {
            if (erro) reject(erro);
            else resolve(linhas);
        });
    });
}

// Consulta uma linha.
function buscarUm(sql, parametros = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, parametros, (erro, linha) => {
            if (erro) reject(erro);
            else resolve(linha);
        });
    });
}

// Executa INSERT, UPDATE, DELETE e comandos de estrutura.
function executar(sql, parametros = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, parametros, function (erro) {
            if (erro) {
                reject(erro);
            } else {
                resolve({
                    id: this.lastID,
                    alteradas: this.changes
                });
            }
        });
    });
}

// =========================================================
// VALIDAÇÕES
// =========================================================

function erroHttp(status, mensagem) {
    const erro = new Error(mensagem);
    erro.status = status;
    return erro;
}

function texto(valor) {
    return typeof valor === 'string' ? valor.trim() : '';
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Confere o formato e se a data existe no calendário.
function dataValida(valor) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        return false;
    }

    const data = new Date(`${valor}T00:00:00.000Z`);

    return (
        !Number.isNaN(data.getTime()) &&
        data.toISOString().slice(0, 10) === valor
    );
}

// Valida os dados comuns; campos extras podem ser exigidos por tela.
function validarPessoa(
    dados,
    exigirPerfil = false,
    exigirNascimento = false,
    exigirGenero = false
) {
    const nome = texto(dados.nome);
    const email = texto(dados.email).toLowerCase();
    const senha = dados.senha;

    if (!nome || !email || typeof senha !== 'string' || !senha) {
        throw erroHttp(400, 'Nome, e-mail e senha são obrigatórios.');
    }

    if (nome.length > 120) {
        throw erroHttp(400, 'O nome deve ter no máximo 120 caracteres.');
    }

    if (!emailValido(email) || email.length > 254) {
        throw erroHttp(400, 'E-mail inválido.');
    }

    // bcrypt trabalha com até 72 bytes de senha.
    if (senha.length < 6 || Buffer.byteLength(senha, 'utf8') > 72) {
        throw erroHttp(
            400,
            'A senha deve ter pelo menos 6 caracteres e no máximo 72 bytes.'
        );
    }

    const idadeInformada =
        dados.idade !== undefined &&
        dados.idade !== null &&
        String(dados.idade).trim() !== '';

    const idade = idadeInformada ? Number(dados.idade) : null;

    if (
        (exigirPerfil || idadeInformada) &&
        (!Number.isInteger(idade) || idade < 18 || idade > 99)
    ) {
        throw erroHttp(400, 'Informe uma idade entre 18 e 99 anos.');
    }

    const nascimento = texto(dados.data_nascimento);

    if ((exigirPerfil || exigirNascimento || nascimento) && !dataValida(nascimento)) {
        throw erroHttp(400, 'Informe uma data de nascimento válida.');
    }

    if (nascimento) {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');

        if (nascimento > `${ano}-${mes}-${dia}`) {
            throw erroHttp(400, 'A data de nascimento não pode ser futura.');
        }
    }

    const genero = texto(dados.genero);
    const generos = ['Masculino', 'Feminino', 'Prefiro_nao_dizer'];

    if (
        (exigirPerfil || exigirGenero || genero) &&
        !generos.includes(genero)
    ) {
        throw erroHttp(400, 'Selecione um gênero válido.');
    }

    return {
        nome,
        email,
        senha,
        idade,
        data_nascimento: nascimento || null,
        genero: genero || null
    };
}

// Encaminha os erros das rotas async para o tratamento final.
const rota = (funcao) => (req, res, next) => {
    Promise.resolve()
        .then(() => funcao(req, res, next))
        .catch(next);
};

// =========================================================
// PREPARAÇÃO DO BANCO
// =========================================================

// Adiciona somente as colunas ausentes.
async function adicionarCampos(tabela, campos) {
    const estrutura = await consultar(`PRAGMA table_info(${tabela})`);
    const existentes = new Set(estrutura.map((coluna) => coluna.name));

    for (const [nome, tipo] of Object.entries(campos)) {
        if (!existentes.has(nome)) {
            await executar(
                `ALTER TABLE ${tabela} ADD COLUMN ${nome} ${tipo}`
            );

            console.log(`Campo adicionado: ${tabela}.${nome}`);
        }
    }
}

async function prepararBanco() {
    await executar('PRAGMA foreign_keys = ON');
    await executar('PRAGMA busy_timeout = 5000');

    // Pessoas cadastradas pela tela de entrada.
    await executar(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha_hash TEXT NOT NULL,
            idade INTEGER,
            data_nascimento TEXT,
            genero TEXT
        )
    `);

    // Atualiza também a tabela usuarios de versões anteriores.
    await adicionarCampos('usuarios', {
        rm: 'TEXT',
        idade: 'INTEGER',
        data_nascimento: 'TEXT',
        genero: 'TEXT'
    });

    await executar(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_rm_unico
        ON usuarios (rm COLLATE NOCASE)
    `);

    // Cadastro de técnicos: separado dos usuários da entrada.
    await executar(`
        CREATE TABLE IF NOT EXISTS tecnicos (
            id_tecnico INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE,
            senha_hash TEXT,
            idade INTEGER,
            data_nascimento TEXT,
            genero TEXT,
            nivel TEXT,
            bio TEXT,
            horario_contato TEXT,
            data_disponivel TEXT
        )
    `);

    await adicionarCampos('tecnicos', {
        email: 'TEXT',
        senha_hash: 'TEXT',
        idade: 'INTEGER',
        data_nascimento: 'TEXT',
        genero: 'TEXT',
        nivel: 'TEXT',
        bio: 'TEXT',
        horario_contato: 'TEXT',
        data_disponivel: 'TEXT'
    });

    // Mantém as demais tabelas do seu projeto.
    await executar(`
        CREATE TABLE IF NOT EXISTS clientes (
            id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT,
            email TEXT
        )
    `);

    await executar(`
        CREATE TABLE IF NOT EXISTS equipamentos (
            id_equipamento INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        )
    `);

    await executar(`
        CREATE TABLE IF NOT EXISTS status_os (
            id_status INTEGER PRIMARY KEY,
            descricao TEXT NOT NULL
        )
    `);

    await executar(`
        CREATE TABLE IF NOT EXISTS ordens_servico (
            id_os INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao_problema TEXT NOT NULL,
            data_os TEXT,
            id_cliente INTEGER,
            id_tecnico INTEGER,
            id_equipamento INTEGER,
            id_status INTEGER,
            FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
            FOREIGN KEY (id_tecnico) REFERENCES tecnicos(id_tecnico),
            FOREIGN KEY (id_equipamento)
                REFERENCES equipamentos(id_equipamento),
            FOREIGN KEY (id_status) REFERENCES status_os(id_status)
        )
    `);

    await executar(`
        INSERT OR IGNORE INTO status_os (id_status, descricao)
        VALUES
            (1, 'Em andamento'),
            (2, 'Concluída'),
            (3, 'Pendente')
    `);
}

// =========================================================
// ROTAS DE API (DEVEM VIR ANTES DOS ARQUIVOS ESTÁTICOS)
// =========================================================

// Cadastro de Usuários
app.post('/api/usuarios/cadastro', rota(async (req, res) => {
    const dados = req.body || {};
    const pessoa = validarPessoa(dados, false, true, true);
    const rm = texto(dados.rm);

    if (!rm || rm.length > 30) {
        throw erroHttp(400, 'Informe um RM válido com até 30 caracteres.');
    }

    const existente = await buscarUm(
        'SELECT id_usuario FROM usuarios WHERE email = ? COLLATE NOCASE',
        [pessoa.email]
    );

    if (existente) {
        throw erroHttp(
            409,
            'Este e-mail já está cadastrado. Nenhum novo registro foi criado.'
        );
    }

    const rmExistente = await buscarUm(
        'SELECT id_usuario FROM usuarios WHERE rm = ? COLLATE NOCASE',
        [rm]
    );

    if (rmExistente) {
        throw erroHttp(409, 'Este RM já está cadastrado.');
    }

    const senhaHash = await bcrypt.hash(pessoa.senha, 10);

    const resultado = await executar(
        `INSERT INTO usuarios
            (nome, email, senha_hash, rm, idade, data_nascimento, genero)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            pessoa.nome,
            pessoa.email,
            senhaHash,
            rm,
            pessoa.idade,
            pessoa.data_nascimento,
            pessoa.genero
        ]
    );

    res.status(201).json({
        mensagem: 'Dados salvos com sucesso.',
        id_usuario: resultado.id
    });
}));

// Login de Usuários
app.post('/api/usuarios/login', rota(async (req, res) => {
    const dados = req.body || {};
    const email = texto(dados.email).toLowerCase();
    const senha = dados.senha;

    if (!email || typeof senha !== 'string' || !senha) {
        throw erroHttp(400, 'E-mail e senha são obrigatórios.');
    }

    if (!emailValido(email)) {
        throw erroHttp(400, 'E-mail inválido.');
    }

    const usuario = await buscarUm(
        'SELECT id_usuario, nome, email, senha_hash FROM usuarios WHERE email = ? COLLATE NOCASE',
        [email]
    );

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash))) {
        throw erroHttp(401, 'E-mail ou senha incorretos.');
    }

    res.json({
        mensagem: 'Login realizado com sucesso.',
        usuario: {
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email
        }
    });
}));

// Cadastro de Técnicos
app.post('/api/tecnicos/cadastro', rota(async (req, res) => {
    const dados = req.body || {};
    const pessoa = validarPessoa(dados);

    const existente = await buscarUm(
        'SELECT id_tecnico FROM tecnicos WHERE email = ? COLLATE NOCASE',
        [pessoa.email]
    );

    if (existente) {
        throw erroHttp(409, 'Este e-mail já está cadastrado como técnico.');
    }

    const senhaHash = await bcrypt.hash(pessoa.senha, 10);

    const resultado = await executar(
        `INSERT INTO tecnicos
            (nome, email, senha_hash, idade, data_nascimento,
             genero, nivel, bio, horario_contato, data_disponivel)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            pessoa.nome,
            pessoa.email,
            senhaHash,
            pessoa.idade,
            pessoa.data_nascimento,
            pessoa.genero,
            texto(dados.nivel) || null,
            texto(dados.bio) || null,
            texto(dados.horario_contato) || null,
            texto(dados.data_disponivel) || null
        ]
    );

    res.status(201).json({
        mensagem: 'Técnico cadastrado com sucesso.',
        id_tecnico: resultado.id
    });
}));

// Login de Técnicos
app.post('/api/tecnicos/login', rota(async (req, res) => {
    const dados = req.body || {};
    const email = texto(dados.email).toLowerCase();
    const senha = dados.senha;

    if (!email || typeof senha !== 'string' || !senha) {
        throw erroHttp(400, 'E-mail e senha são obrigatórios.');
    }

    const tecnico = await buscarUm(
        'SELECT * FROM tecnicos WHERE email = ? COLLATE NOCASE',
        [email]
    );

    if (
        !tecnico ||
        !tecnico.senha_hash ||
        !(await bcrypt.compare(senha, tecnico.senha_hash))
    ) {
        throw erroHttp(401, 'E-mail ou senha incorretos.');
    }

    res.json({
        mensagem: 'Login realizado com sucesso.',
        tecnico: {
            id_tecnico: tecnico.id_tecnico,
            nome: tecnico.nome,
            email: tecnico.email
        }
    });
}));

// Rota de Saúde/Teste
app.get('/api/saude', rota(async (req, res) => {
    await buscarUm('SELECT 1 AS ok');
    res.json({ api: 'ok', banco: 'ok' });
}));

// =========================================================
// ARQUIVOS ESTÁTICOS DO FRONT-END
// =========================================================

const extensoesPublicas = new Set([
    '.html', '.css', '.js', '.png', '.jpg', '.jpeg',
    '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf'
]);

const arquivosInternos = new Set([
    'server.js', 'api.js', 'database.js', 'consulta.js',
    'estrutura.js', 'validacao.js', 'erros.js', 'clientes.js',
    'tecnicos.js', 'equipamentos.js', 'ordens.js',
    'relatorios.js', 'usuarios.js', 'banco.js', 'pessoas.js',
    'atualizar-banco.js'
]);

app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        return next();
    }

    let caminho;

    try {
        caminho = decodeURIComponent(req.path);
    } catch {
        return res.status(400).send('Endereço inválido.');
    }

    const nome = path.basename(caminho).toLowerCase();
    const extensao = path.extname(caminho).toLowerCase();

    if (
        caminho.includes('/node_modules/') ||
        arquivosInternos.has(nome) ||
        (caminho !== '/' && !extensoesPublicas.has(extensao))
    ) {
        return next();
    }

    return express.static(__dirname, {
        dotfiles: 'deny',
        index: 'index.html'
    })(req, res, next);
});

// =========================================================
// TRATAMENTO DE ERROS
// =========================================================

app.use((req, res) => {
    res.status(404).json({
        erro: `Rota não encontrada: ${req.method} ${req.originalUrl}`
    });
});

app.use((erro, req, res, next) => {
    console.error(erro);

    if (erro.type === 'entity.parse.failed') {
        return res.status(400).json({ erro: 'JSON inválido.' });
    }

    if (erro.status) {
        return res.status(erro.status).json({ erro: erro.message });
    }

    if (
        erro.code === 'SQLITE_CONSTRAINT' &&
        /UNIQUE/i.test(erro.message)
    ) {
        return res.status(409).json({
            erro: 'Já existe um cadastro com esses dados.'
        });
    }

    res.status(500).json({
        erro: 'Erro interno. Confira a mensagem no terminal.'
    });
});

// =========================================================
// INICIAR O SERVIDOR
// =========================================================

prepararBanco()
    .then(() => {
        const servidor = app.listen(3000, '127.0.0.1', () => {
            console.log('==========================================');
            console.log('SITE + BACK-END FUNCIONANDO');
            console.log('Abra: http://localhost:3000/index.html');
            console.log('Banco:', caminhoBanco);
            console.log('==========================================');
        });

        servidor.on('error', (erro) => {
            console.error('Não foi possível iniciar:', erro.message);
            db.close();
            process.exitCode = 1;
        });
    })
    .catch((erro) => {
        console.error('Erro ao preparar o banco:', erro.message);
        db.close();
        process.exitCode = 1;
    });