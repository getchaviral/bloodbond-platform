const test = require("node:test");
const assert = require("node:assert/strict");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret_key";
process.env.CORS_ORIGINS = process.env.CORS_ORIGINS || "http://localhost:5173";
delete process.env.AI_API_KEY;
delete process.env.OPENAI_API_KEY;

const createApp = require("../app");

function createServer() {
  return createApp().listen(0);
}

function getBaseUrl(server) {
  const address = server.address();
  return `http://127.0.0.1:${address.port}`;
}

async function ask(server, body) {
  return fetch(`${getBaseUrl(server)}/api/ai/assistant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("POST /api/ai/assistant returns 400 when question is missing", async () => {
  const server = createServer();
  try {
    const res = await ask(server, {});
    assert.equal(res.status, 400);
    const payload = await res.json();
    assert.equal(payload.message, "Question is required");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("POST /api/ai/assistant returns 400 for an over long question", async () => {
  const server = createServer();
  try {
    const res = await ask(server, { question: "a".repeat(1001) });
    assert.equal(res.status, 400);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("POST /api/ai/assistant answers locally when no AI key is set", async () => {
  const server = createServer();
  try {
    const res = await ask(server, { question: "Who can donate blood?" });
    assert.equal(res.status, 200);
    const payload = await res.json();
    assert.equal(payload.source, "local");
    assert.match(payload.reply, /donate/i);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("POST /api/ai/assistant rate limits after 20 requests", async () => {
  const server = createServer();
  try {
    const statuses = [];
    for (let i = 0; i < 25; i += 1) {
      const res = await ask(server, { question: `question ${i}` });
      statuses.push(res.status);
    }
    assert.ok(statuses.includes(429), "expected a 429 response");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
