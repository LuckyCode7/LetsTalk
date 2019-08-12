const fs = require('fs');
const PeerServer = require('peer').PeerServer;

const privKey = fs.readFileSync('./sslcert/server.key', 'utf-8');
const certificate = fs.readFileSync('./sslcert/server.cert', 'utf-8');

const server = PeerServer({
    port: 9000,
    path: '/peerjs',
    ssl: {
        key: privKey,
        cert: certificate
    }
});

console.log("peerJS server works");