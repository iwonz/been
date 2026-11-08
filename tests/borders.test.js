import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { roundBorderCoordinates } from '../src/utils/roundBorderCoordinates.ts';

test('rounding preserves metadata, rings, point order and five-decimal precision', () => {
  const borders = {
    TEST: {
      type: 'Feature',
      properties: { iso3166: 'TEST', name: 'Тест', value: 1.123456789 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-12.1234567, 45.7654321],
            [0, 0],
            [1.111111, 2.222222],
          ],
          [
            [1, 1],
            [1, 2],
            [2, 1],
            [1, 1],
          ],
        ],
      },
    },
  };
  const original = structuredClone(borders);
  const result = roundBorderCoordinates(borders);
  assert.deepEqual(result.TEST.properties, original.TEST.properties);
  assert.equal(result.TEST.geometry.coordinates.length, 2);
  result.TEST.geometry.coordinates.forEach((ring, i) => {
    assert.equal(ring.length, original.TEST.geometry.coordinates[i].length);
    ring.forEach((point, j) => {
      point.forEach((value, k) => {
        assert.ok(Math.abs(value - original.TEST.geometry.coordinates[i][j][k]) <= 0.000005);
        assert.equal(value, Number(value.toFixed(5)));
      });
    });
  });
  assert.deepEqual(roundBorderCoordinates(structuredClone(result)), result);
});

test('committed borders contain valid polygons with compact coordinates', () => {
  for (const name of ['countries', 'regions']) {
    const borders = JSON.parse(readFileSync(new URL(`../public/${name}.json`, import.meta.url)));
    for (const [code, border] of Object.entries(borders)) {
      assert.equal(border.type, 'Feature');
      assert.equal(border.properties.iso3166, code);
      assert.equal(border.geometry.type, 'Polygon');
      for (const ring of border.geometry.coordinates) {
        assert.ok(ring.length >= 3);
        for (const point of ring) {
          assert.equal(point.length, 2);
          point.forEach((value) => {
            assert.ok(Number.isFinite(value));
            assert.equal(value, Number(value.toFixed(5)));
          });
        }
      }
    }
  }
});
