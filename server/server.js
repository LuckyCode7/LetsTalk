let http = require('http');
let fs = require('fs');

let server = http.createServer((req, res) => {
    switch (req.url) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            let html = fs.readFileSync('../public/html/index.html', 'utf8');
            res.end(html);
            break;
        case '/style/style.css':
            res.writeHead(200, { 'Content-type': 'text/css' });
            let css = fs.readFileSync('../public/style/style.css', 'utf8');
            res.end(css);
            break;
        case '/img/background.png':
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            let jpg = fs.readFileSync('../public/img/background.png', 'binary');
            res.end(jpg, 'binary');
            break;
        case '/dist/bundle.js':
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            let js = fs.readFileSync('../dist/bundle.js', 'utf8');
            res.end(js);
            break;
        default:
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("404 Not Found\n");
            res.end();
            break;
    }
});

server.listen(8080, () => {
    console.log("Server is listening on port 8080");
});