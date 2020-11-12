const mysql = require('promise-mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'electron_store'
});

function getConnection() {
    return connection;
}

module.exports = { getConnection }