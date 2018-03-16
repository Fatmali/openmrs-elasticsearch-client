const mysql = require('mysql');
const config = {
        host : 'XX.XX.XX.XX',
        port : 'XXXX',
        user : 'XXXX',
        password : 'XXXX'
};

const connection = mysql.createPool(config);
module.exports = config

