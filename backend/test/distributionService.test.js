const test = require("node:test");
const assert = require("node:assert/strict");

// Mock MySQL before loading the real FIFO service.
let currentConnection;

const dbPath = require.resolve("../src/config/db");

require.cache[dbPath] = {
  id: dbPath,
  filename: dbPath,
  loaded: true,
  exports: {
    getConnection: async () => currentConnection,
  },
};

const {
  distributeCrop,
} = require("../src/services/distributionService");

function setupDatabase(rows) {
  const calls = {
    select: "",
    updates: [],
    inserts: [],
    commits: 0,
    rollbacks: 0,
    releases: 0,
  };

  currentConnection = {
    async beginTransaction() {},

    async execute(sql, params = []) {
      if (sql.includes("FROM crop_batches")) {
        calls.select = sql;
        return [rows];
      }

      if (sql.includes("UPDATE crop_batches")) {
        calls.updates.push(params);
        return [{ affectedRows: 1 }];
      }

      if (sql.includes("INSERT INTO distributions")) {
        calls.inserts.push(params);
        return [{ insertId: 100 }];
      }

      throw new Error("Unexpected SQL query");
    },

    async commit() {
      calls.commits++;
    },

    async rollback() {
      calls.rollbacks++;
    },

    release() {
      calls.releases++;
    },
  };

  return calls;
}

// TEST 1
test("FIFO selects oldest available batch", async () => {
  const calls = setupDatabase([
    { id: 1, crop_name: "Tomato", quantity: 10 },
  ]);

  const result = await distributeCrop(5);

  assert.match(
    calls.select,
    /ORDER BY harvest_date ASC, id ASC\s+LIMIT 1\s+FOR UPDATE/
  );

  assert.equal(result.cropBatchId, 1);
  assert.equal(calls.commits, 1);
});

// TEST 2
test("Partial distribution updates remaining quantity", async () => {
  const calls = setupDatabase([
    { id: 1, crop_name: "Tomato", quantity: 10 },
  ]);

  const result = await distributeCrop(4);

  assert.equal(result.distributedQuantity, 4);
  assert.equal(result.remainingQuantity, 6);
  assert.equal(result.status, "AVAILABLE");

  assert.deepEqual(calls.updates[0], [
    6,
    "AVAILABLE",
    1,
  ]);

  assert.deepEqual(calls.inserts[0], [1, 4]);
  assert.equal(calls.commits, 1);
  assert.equal(calls.releases, 1);
});

// TEST 3
test("Full distribution marks batch DISTRIBUTED", async () => {
  const calls = setupDatabase([
    { id: 2, crop_name: "Carrot", quantity: 10 },
  ]);

  const result = await distributeCrop(10);

  assert.equal(result.remainingQuantity, 0);
  assert.equal(result.status, "DISTRIBUTED");

  assert.deepEqual(calls.updates[0], [
    0,
    "DISTRIBUTED",
    2,
  ]);
});

// TEST 4
test("Rejects quantity greater than current FIFO batch", async () => {
  const calls = setupDatabase([
    { id: 1, crop_name: "Tomato", quantity: 5 },
  ]);

  await assert.rejects(
    distributeCrop(10),
    (error) => error.status === 400
  );

  assert.equal(calls.updates.length, 0);
  assert.equal(calls.inserts.length, 0);
  assert.equal(calls.rollbacks, 1);
  assert.equal(calls.releases, 1);
});

// TEST 5
test("Rejects distribution when no crops are available", async () => {
  const calls = setupDatabase([]);

  await assert.rejects(
    distributeCrop(5),
    (error) => error.status === 404
  );

  assert.equal(calls.commits, 0);
  assert.equal(calls.rollbacks, 1);
  assert.equal(calls.releases, 1);
});
