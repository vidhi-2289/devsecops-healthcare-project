const http = require('http');

const PORT = 3002;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });

  res.end(JSON.stringify({
    application: "Healthcare Management System",
    security: "DevSecOps Enabled",
    status: "Running Securely"
  }));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
