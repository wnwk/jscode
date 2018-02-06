var mysql = require('promise-mysql');
var mysqlDump = require('mysqldump');
var fs = require('fs');
var path = require("path");
var root = path.join(__dirname);


var host = '';
var user = '';
var pwd = '';
var db = '';

var sql = 'select  table_name from information_schema.TABLES where TABLE_SCHEMA="db"';
mysql.createConnection({
    host: host,
    user: user,
    password: pwd,
    database: db,
    port: '3306'
}).then(function (conn) {
    // do stuff with conn
    var result = conn.query(sql);
    conn.end();
    return result;
}).then(function (rows) {

    var list;
    for (var i = 0, tablename; tablename = rows[i++];) {
        var table = tablename.table_name;
        if (!fs.existsSync(table + '.sql')) {
            // console.log(table + ' exist');

            (function (i, table) {
                setTimeout(function () {
                    console.log(table + '.sql');
                    mysqlDump({
                        host: host,
                        user: user,
                        password: pwd,
                        database: db,
                        port: '3306',
                        tables: [table], // only these tables 
                        dest: table + '.sql' // destination file 
                    }, function (err) {
                        // mysql.connection.end();
                        console.log(table + " close connection");
                    })
                }, i * 10000);
            })(i, table);


        }
    }

});

