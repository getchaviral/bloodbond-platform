const test = require("node:test");
const assert = require("node:assert/strict");
const rateLimit = require("../middleware/rateLimit");

test("rateLimit blocks after max requests", () => {
  const middleware = rateLimit({ windowMs: 60_000, max: 2 });
  const req = { path: "/login", headers: {}, ip: "127.0.0.1" };

  const makeRes = () => {
    const res = {
      statusCode: 200,
      payload: null,
      headers: {},
      set(name, value) {
        this.headers[name] = value;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.payload = body;
        return this;
      },
    };
    return res;
  };

  let nextCalled = 0;
  middleware(req, makeRes(), () => {
    nextCalled += 1;
  });
  middleware(req, makeRes(), () => {
    nextCalled += 1;
  });

  const blockedRes = makeRes();
  middleware(req, blockedRes, () => {
    nextCalled += 1;
  });

  assert.equal(nextCalled, 2);
  assert.equal(blockedRes.statusCode, 429);
  assert.equal(
    blockedRes.payload.message,
    "Too many requests. Please try again later."
  );
});
