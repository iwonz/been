import assert from 'node:assert/strict';
import test from 'node:test';
import { forEachInBatches } from '../src/utils/forEachInBatches.ts';
import { loadBorders } from '../src/utils/loadBorders.ts';

test('batches allow timers to run before completion and preserve order', async () => {
  const visited = [];
  let countBetweenBatches;
  const pending = forEachInBatches(
    Array.from({ length: 20 }, (_, i) => i),
    (item) => {
      visited.push(item);
      if (item === 0)
        setTimeout(() => {
          countBetweenBatches = visited.length;
        }, 0);
    },
  );
  assert.equal(visited.length, 0);
  await pending;
  assert.ok(countBetweenBatches > 0 && countBetweenBatches < 20);
  assert.deepEqual(
    visited,
    Array.from({ length: 20 }, (_, i) => i),
  );
  await assert.rejects(
    forEachInBatches([1], () => {
      throw new Error('render failed');
    }),
    /render failed/,
  );
});

const feature = {
  type: 'Feature',
  properties: { iso3166: 'XX', name: 'Test' },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    ],
  },
};

test('loading checks HTTP, JSON and polygon structure before adding objects', async (t) => {
  const fetchMock = t.mock.method(
    globalThis,
    'fetch',
    async () => new Response('', { status: 503 }),
  );
  const added = [];
  await assert.rejects(
    loadBorders('/borders.json', (x) => added.push(x)),
    /HTTP 503/,
  );
  for (const invalid of [
    'not json',
    'null',
    '[]',
    '{"XX":null}',
    JSON.stringify({
      XX: {
        ...feature,
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [1, null],
              [3, 4],
              [5, 6],
            ],
          ],
        },
      },
    }),
  ]) {
    fetchMock.mock.mockImplementation(async () => new Response(invalid));
    await assert.rejects(loadBorders('/borders.json', (x) => added.push(x)));
  }
  assert.equal(added.length, 0);
  fetchMock.mock.mockImplementation(async () => new Response(JSON.stringify({ XX: feature })));
  await loadBorders('/borders.json', (x) => added.push(x));
  assert.deepEqual(added, [feature]);
});

test('a pending layer does not delay another layer', async (t) => {
  let release;
  t.mock.method(globalThis, 'fetch', (url) =>
    url === '/slow'
      ? new Promise((resolve) => {
          release = resolve;
        })
      : Promise.resolve(new Response(JSON.stringify({ XX: feature }))),
  );
  const added = [];
  const slow = loadBorders('/slow', () => added.push('slow'));
  await loadBorders('/fast', () => added.push('fast'));
  assert.deepEqual(added, ['fast']);
  release(new Response(JSON.stringify({ XX: feature })));
  await slow;
  assert.deepEqual(added, ['fast', 'slow']);
});
