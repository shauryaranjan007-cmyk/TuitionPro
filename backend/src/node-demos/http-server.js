import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Node HTTP works", status: "success" }));
});

const PORT = 5050;
server.listen(PORT, () => {
  console.log(`HTTP server running at http://localhost:${PORT}`);
  console.log("Press Ctrl+C to stop.");
});
