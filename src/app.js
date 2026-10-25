// Import Node.js's built-in HTTP module; no third-party package is needed.
const http = require("node:http");

// Read the port from an environment variable, or use 3000 locally.
const PORT = Number(process.env.PORT || 3000);

// Handle one incoming HTTP request and write its response.
function handler(req, res) {
  // Tell clients that the response body is JSON encoded as UTF-8.
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  // Match the homepage route and only allow GET requests.
  if (req.method === "GET" && req.url === "/") {
    // Send HTTP status 200, meaning the request succeeded.
    res.writeHead(200);
    // Return a JSON response describing the application.
    return res.end(JSON.stringify({
      application: "DevOps Status API", // Human-readable application name.
      version: "1.0.0", // Application version for this learning release.
      status: "running" // Simple application status value.
    }));
  }

  // A health endpoint is commonly used by monitoring and deployment systems.
  if (req.method === "GET" && req.url === "/health") {
    // Return HTTP 200 when this process can answer requests.
    res.writeHead(200);
    // Send a small JSON health response and finish the request.
    return res.end(JSON.stringify({ status: "healthy" }));
  }

  // Any route not handled above returns HTTP 404 (Not Found).
  res.writeHead(404);
  // Explain the error in a machine-readable JSON response.
  return res.end(JSON.stringify({ error: "Not found" }));
}

// Create an HTTP server that calls handler for every request.
const server = http.createServer(handler);

// Start listening only when this file is run directly, not when tests import it.
if (require.main === module) {
  // Listen on all container interfaces so Docker port publishing can reach the app.
  server.listen(PORT, "0.0.0.0", () => {
    // Print a startup message to container or terminal logs.
    console.log(`DevOps Status API listening on port ${PORT}`);
  });
}

// Export the handler and server so tests can exercise the logic.
module.exports = { handler, server };
