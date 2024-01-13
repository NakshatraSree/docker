const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const { url } = req;

  // Define routes for different HTML pages
  switch (url) {
    case '/':
      serveHTML('index.html', res);
      break;
    case '/login':
      serveHTML('login.html', res);
      break;
    case '/register':
      serveHTML('register.html', res);
      break;
    case '/userlist':
      serveHTML('userslist.html', res);
      break;
    default:
      serveError(res);
      break;
  }
});

// Function to serve HTML files
function serveHTML(fileName, res) {
  const filePath = path.join(__dirname, fileName);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Server Error: ${err.code}`);
    } else {
      const extname = path.extname(filePath);
      const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
      }[extname] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

// Function to serve error message for unknown routes
function serveError(res) {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('404 - File Not Found');
}

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
