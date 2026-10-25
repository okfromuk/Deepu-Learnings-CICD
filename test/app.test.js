// Import Node.js's built-in test runner.
const { test } = require("node:test");
// Import assertions used to compare expected and actual values.
const assert = require("node:assert/strict");
// Import the API request handler without starting a listening server.
const { handler } = require("../src/app");

// Create a lightweight fake request/response to test the handler without a network port.
function invoke(path, method = "GET") {
  // Return a Promise so each test can await the response.
  return new Promise((resolve) => {
    // Simulate the fields of an incoming Node.js HTTP request.
    const req = { method, url: path };
    // Store response headers set by the handler.
    const headers = {};
    // Simulate the response object expected by the handler.
    const res = {
      statusCode: 200, // Default status until writeHead changes it.
      setHeader(name, value) { headers[name] = value; }, // Record a response header.
      writeHead(code) { this.statusCode = code; }, // Record the HTTP status code.
      end(body) { // Called when the handler finishes its response.
        resolve({ statusCode: this.statusCode, headers, body: JSON.parse(body) });
      }
    };
    // Run the real handler against the simulated request and response.
    handler(req, res);
  });
}

// Verify the homepage returns a successful response with expected fields.
test("GET / returns application status", async () => {
  const result = await invoke("/"); // Call the homepage route.
  assert.equal(result.statusCode, 200); // Expect HTTP OK.
  assert.equal(result.body.application, "DevOps Status API"); // Check app name.
  assert.equal(result.body.status, "running"); // Check reported status.
});

// Verify the health endpoint returns healthy.
test("GET /health returns healthy", async () => {
  const result = await invoke("/health"); // Call the health route.
  assert.equal(result.statusCode, 200); // Expect HTTP OK.
  assert.equal(result.body.status, "healthy"); // Check health field.
});

// Verify unsupported routes return a not-found response.
test("unknown route returns 404", async () => {
  const result = await invoke("/missing"); // Call a route that does not exist.
  assert.equal(result.statusCode, 404); // Expect HTTP Not Found.
  assert.equal(result.body.error, "Not found"); // Check error message.
});
