const mysql = require('mysql');
const shortid = require('shortid');

class DB {
    constructor(config) {
        this.host = config.host;
        this.port = config.port;
        this.connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.pass,
            database: 'letstalk',
            port: config.port
        });
    }

    connect() {
        this.connection.connect(error => {
            if (error) {
                console.log(error);
            } else
                console.log("Connected to " + this.host + ":" + this.port);
        });
    }

    disconnect() {
        this.connection.end();
    }

    getUserInfoAsync(pass) {
        return new Promise((resolve, reject) => {
            this.connect();

            const query = `
            SELECT login, peer_id, status, mail, activity
            FROM users
            WHERE pass = ?`;

            this.connection.query(query, [pass], (error, results, fields) => {
                if (error) reject(error);
                if (typeof(results) !== 'undefined') {
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            });

            this.disconnect();
        });
    }

    getUserInfoAsync2(login) {
        return new Promise((resolve, reject) => {
            this.connect();

            const query = `
            SELECT login, peer_id, status, mail, activity
            FROM users
            WHERE login = ?`;

            this.connection.query(query, [login], (error, results, fields) => {
                if (error) reject(error);
                if (typeof(results) !== 'undefined') {
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            });

            this.disconnect();
        });
    }

    getUsersLoginAsync(pass) {
        return new Promise((resolve, reject) => {
            this.connect();

            const query = `
            SELECT login
            FROM users
            WHERE pass = ?`;

            this.connection.query(query, [pass], (error, results, fields) => {
                if (error) reject(error);
                if (typeof(results[0]) !== 'undefined') {
                    resolve(results[0].login);
                } else {
                    resolve(null);
                }
            });

            this.disconnect();
        });
    }

    getPeerIdAsync(username) {
        return new Promise((resolve, reject) => {
            this.connect();

            const query = `
            SELECT peer_id
            FROM users
            WHERE login = ?`;

            this.connection.query(query, [username], (error, results, fields) => {
                if (error) reject(error);
                if (typeof(results) !== 'undefined') {
                    resolve(results[0].peer_id);
                } else {
                    resolve(null);
                }
            });

            this.disconnect();
        });
    }

    getUsersAsync() {
        return new Promise((resolve, reject) => {
            this.connect();

            const query = `
            SELECT login
            FROM users`;

            this.connection.query(query, (error, results, fields) => {
                if (error) reject(error);
                if (typeof(results) !== 'undefined') {
                    resolve(results);
                } else {
                    resolve(null);
                }
            });

            this.disconnect();
        });
    }

    setUserStatus(username, status) {
        this.connect();

        const query = `
            UPDATE users
            SET status = ?
            WHERE login = ?`;

        this.connection.query(query, [status, username], (error, results, fields) => {
            if (error) {
                console.log(error);
            } else {
                //console.log(results);
            }
        });

        this.disconnect();
    }

    setUserActivity(username, status) {
        this.connect();

        const query = `
            UPDATE users
            SET activity = ?
            WHERE login = ?`;

        this.connection.query(query, [status, username], (error, results, fields) => {
            if (error) {
                console.log(error);
            } else {
                // console.log(results);
            }
        });

        this.disconnect();
    }
}
//console.log(shortid.generate() + shortid.generate());

// const db = new DB('192.168.1.12', 'root', 'root', 3306);
// db.getUserInfoAsync('admin').then(r => {
//     console.log("otrzymalem " + r.status);
// }).catch(function(error) {
//     console.log(error);
// });



module.exports.DB = DB;