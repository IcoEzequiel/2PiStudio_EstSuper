const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'seu_usuario',
    password: 'sua_senha',
    database: 'sistema_servicos'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados!');
});

module.exports = connection;
