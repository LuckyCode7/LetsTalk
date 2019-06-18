const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();

const httpPort = 8080;
const httpsPort = 8081;

const privKey = fs.readFileSync('sslcert/key.pem', 'utf-8');
const certificate = fs.readFileSync('sslcert/cert.pem', 'utf-8');

const credentials = { key: privKey, cert: certificate };

const htdocsPath = 'public/';
const html = htdocsPath + 'html';
const css = htdocsPath + 'style';
const img = htdocsPath + 'img';
const js = 'dist';

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.use(express.static(html));
app.use(express.static(css));
app.use(express.static(img));
app.use(express.static(js));

app.get('/', (req, res) => {
    res.sendFile("index.html");
});

httpServer.listen(httpPort, () => {
    console.log(`HTTP Server is listening on port: ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server is listening on port: ${httpsPort}`);
});