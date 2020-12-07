const mysql = require('mysql');
const { db } = require('../config');

let __instance;

function initDB() {
    __instance = mysql.createConnection({
        host: db.host,
        port: db.port,
        user: db.user,
        password: db.password,
        database: db.database
    });

    __instance.connect(function (err) {
        if (err) {
            console.log('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + __instance.threadId);
    });
    __instance.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };

    return __instance;
}

function getInstance() {
    return (__instance != undefined) ? __instance : initDB();
}

module.exports = getInstance();