const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const reload = require('reload');
const path = require('path');
const cookieParser = require('cookie-parser');
const WebSocketServer = require('ws').Server;
const moment = require('moment');

const configDB = {
    host: '192.168.1.12',
    user: 'root',
    pass: 'root',
    port: 3306
};

const { DB } = require(path.join(__dirname, '../public/MySQL', 'db.js'));

const app = express();

const httpPort = 8080;
const httpsPort = 8081;

const privKey = fs.readFileSync(path.join(__dirname, '../sslcert', 'server.key'), 'utf-8');
const certificate = fs.readFileSync(path.join(__dirname, '../sslcert', 'server.cert'), 'utf-8');

const credentials = { key: privKey, cert: certificate };

const htdocsPath = path.resolve(__dirname, '../public', 'html');

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

// const wss = new WebSocketServer({ server: httpsServer });

// wss.on('connection', function(w) {
//     // send when client first online
//     w.send('Welcome to wss server');
//     console.log(w)

//     w.on('message', function(message) {
//         console.log("message from client: " + message);
//     });

//     w.on('close', function() {
//         console.log("Klient out");
//     });

//     setInterval(function() {
//         wss.clients.forEach(function(client) {
//             console.log(client.readyState);
//             if (client.readyState === client.OPEN) {

//                 client.send("new message from server :)");
//             } //else if (clients.readyState === client.CLOSED) {
//             // console.log("Klient sie zmyl :(");
//             //}
//         })
//     }, 5000);

// wss.on('message', function(msg) {
//     console.log('message from client');
// });

// wss.on('close', function() {
//     console.log('closing connection');
// });


//});


app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static('dist'));

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        const url = req.headers.host + req.url;

        res.redirect('https://' + url.split(':')[0] + ':' + httpsPort);
    }
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(htdocsPath, 'index.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(htdocsPath, 'chat.html'));
});

app.post('/auth', function(req, res) {
    const login = req.body.login;
    const pass = req.body.pass;
    const db = new DB(configDB);

    db.getUserInfoAsync(pass).then(response => {
        if (response.login === login) {
            res.cookie('login', response.login);
            res.cookie('peer', response.peer_id);
            res.redirect("/chat");
        } else {
            console.log("Zle haslo lub login");
        }
    }).catch(err => {
        console.log(err);
    }).finally(() => {
        new DB(configDB).setUserStatus(login, "online");
    });
});

app.get('/getUsers', (req, res) => {
    const db = new DB(configDB);
    db.getUsersAsync().then(users => {
        res.send(users);
    });
});

app.get('/getUserInfo', (req, res) => {
    const db = new DB(configDB);
    db.getUserInfoAsync2(req.query.login).then(user => {
        res.send(user);
    });
});

app.get('/getUserPeer', (req, res) => {
    const db = new DB(configDB);
    db.getPeerIdAsync(req.query.login).then(peerID => {
        res.send(peerID);
    });
});

app.get('/logout', (req, res) => {
    new DB(configDB).setUserStatus(req.cookies.login, "offline");
    new DB(configDB).setUserActivity(req.cookies.login, moment().format('LLL'));

    res.send({ url: '/' });
});

httpServer.listen(httpPort, () => {
    console.log(`HTTP Server is listening on port: ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server is listening on port: ${httpsPort}`);
});

reload(app);