const http = require('http');
const express = require('express');
const app = express();

const httpPort = 8080;

const htdocsPath = 'public/';
const html = htdocsPath + 'html';
const css = htdocsPath + 'style';
const img = htdocsPath + 'img';
const js = 'dist';

let httpServer = http.createServer(app);

app.use(express.static(html));
app.use(express.static(css));
app.use(express.static(img));
app.use(express.static(js));

app.get('/', (req, res) => {
    res.sendFile("index.html");
});

httpServer.listen(httpPort, () => {
    console.log(`Server is listening on port: ${httpPort}`);
});