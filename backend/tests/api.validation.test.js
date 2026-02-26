const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret_key";
process.env.CORS_ORIGINS = process.env.CORS_ORIGINS || "http://localhost:5173";

const createApp = require("../app");

function createServer() {
  const app = createApp();
  return app.listen(0);
}

function getBaseUrl(server) {
  const address = server.address();
  return `http://127.0.0.1:${address.port}`;
}

test("POST /api/auth/register returns 400 for missing fields", async () => {
  const server = createServer();
  try {
    const res = await fetch(`${getBaseUrl(server)}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.message, "Name, email and password are required");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("POST /api/auth/login returns 400 for invalid email format", async () => {
  const server = createServer();
  try {
    const res = await fetch(`${getBaseUrl(server)}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid-email", password: "password123" }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.message, "Invalid email format");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("POST /api/user/request returns 401 without bearer token", async () => {
  const server = createServer();
  try {
    const res = await fetch(`${getBaseUrl(server)}/api/user/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bloodGroup: "A+", units: 1 }),
    });

    assert.equal(res.status, 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("POST /api/user/request returns 400 for invalid blood group", async () => {
  const server = createServer();
  const token = jwt.sign(
    { id: "507f1f77bcf86cd799439011", role: "user" },
    process.env.JWT_SECRET
  );

  try {
    const res = await fetch(`${getBaseUrl(server)}/api/user/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bloodGroup: "X+", units: 1 }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.message, "Invalid blood group");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
