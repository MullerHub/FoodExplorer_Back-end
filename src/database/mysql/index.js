const mysql = require('mysql2');

// Criar uma conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // substitua pelo nome de usuário do seu banco de dados
  password: '', // substitua pela senha do seu banco de dados
  database: 'teste_explorer' // substitua pelo nome do seu banco de dados
});

// Testar a conexão
connection.connect(function(err) {
  if (err) throw err;
  console.log('Conectado com sucesso ao banco de dados!');
});

// Executar uma consulta
connection.query('SELECT * FROM users', function (error, results, fields) {
  if (error) throw error;
  console.log('Resultado da consulta: ', results);
});

// Fechar a conexão
connection.end();
