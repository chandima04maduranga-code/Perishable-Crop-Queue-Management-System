const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

// Test-only secret. Not a real application credential.
process.env.JWT_SECRET = "cropqueue-local-unit-test-secret";

let mockUsers = [];

// Mock the database before importing authenticate.
const dbPath = require.resolve("../src/config/db");

require.cache[dbPath] = {
  id: dbPath,
  filename: dbPath,
  loaded: true,
  exports: {
    execute: async (sql, params) => {
      assert.match(sql, /FROM users/);

      return [
        mockUsers.filter(
          (user) => user.id === params[0]
        ),
      ];
    },
  },
};

const authenticate = require(
  "../src/middleware/authenticate"
);

const authorize = require(
  "../src/middleware/authorize"
);

function createResponse() {
  return {
    statusCode: 200,
    body: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(data) {
      this.body = data;
      return this;
    },
  };
}

function createToken() {
  return jwt.sign(
    { id: 101 },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

async function checkAuthentication(header) {
  const req = {
    headers: header
      ? { authorization: header }
      : {},
  };

  const res = createResponse();
  let nextCalled = false;

  await authenticate(req, res, () => {
    nextCalled = true;
  });

  return { req, res, nextCalled };
}

// TEST 1
test("Missing JWT returns 401", async () => {
  const result = await checkAuthentication(null);

  assert.equal(result.res.statusCode, 401);
  assert.equal(result.nextCalled, false);
});

// TEST 2
test("Invalid JWT returns 401", async () => {
  const result = await checkAuthentication(
    "Bearer invalid-token"
  );

  assert.equal(result.res.statusCode, 401);
  assert.equal(result.nextCalled, false);
});

// TEST 3
test("Expired JWT returns 401", async () => {
  const expiredToken = jwt.sign(
    {
      id: 101,
      exp: Math.floor(Date.now() / 1000) - 60,
    },
    process.env.JWT_SECRET
  );

  const result = await checkAuthentication(
    `Bearer ${expiredToken}`
  );

  assert.equal(result.res.statusCode, 401);
});

// TEST 4
test("Unknown user returns 401", async () => {
  mockUsers = [];

  const result = await checkAuthentication(
    `Bearer ${createToken()}`
  );

  assert.equal(result.res.statusCode, 401);
});

// TEST 5
test("PENDING user returns 403", async () => {
  mockUsers = [
    { id: 101, role: "DISTRIBUTOR", status: "PENDING" },
  ];

  const result = await checkAuthentication(
    `Bearer ${createToken()}`
  );

  assert.equal(result.res.statusCode, 403);
  assert.equal(result.nextCalled, false);
});

// TEST 6
test("DISABLED user returns 403", async () => {
  mockUsers = [
    { id: 101, role: "ADMIN", status: "DISABLED" },
  ];

  const result = await checkAuthentication(
    `Bearer ${createToken()}`
  );

  assert.equal(result.res.statusCode, 403);
  assert.equal(result.nextCalled, false);
});

// TEST 7
test("ACTIVE user with valid JWT is authenticated", async () => {
  mockUsers = [
    { id: 101, role: "ADMIN", status: "ACTIVE" },
  ];

  const result = await checkAuthentication(
    `Bearer ${createToken()}`
  );

  assert.equal(result.nextCalled, true);
  assert.equal(result.req.user.role, "ADMIN");
});

// TEST 8
test("FARM_MANAGER cannot distribute crops", () => {
  const req = {
    user: { role: "FARM_MANAGER" },
  };

  const res = createResponse();
  let nextCalled = false;

  authorize("ADMIN", "DISTRIBUTOR")(
    req,
    res,
    () => {
      nextCalled = true;
    }
  );

  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

// TEST 9
test("DISTRIBUTOR is allowed by distribution role check", () => {
  const req = {
    user: { role: "DISTRIBUTOR" },
  };

  const res = createResponse();
  let nextCalled = false;

  authorize("ADMIN", "DISTRIBUTOR")(
    req,
    res,
    () => {
      nextCalled = true;
    }
  );

  assert.equal(nextCalled, true);
});

// TEST 10
test("Non-ADMIN cannot access admin role check", () => {
  const req = {
    user: { role: "DISTRIBUTOR" },
  };

  const res = createResponse();
  let nextCalled = false;

  authorize("ADMIN")(
    req,
    res,
    () => {
      nextCalled = true;
    }
  );

  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});
