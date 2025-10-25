import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SpatialRepository, haversineDistanceMeters } from '../src/db.js';

describe('PostGIS Spatial Geo Finder Tests', () => {
  test('should accurately calculate Haversine distance between two known coordinates', () => {
    // Cyber Towers (17.4504, 78.3808) to Mindspace (17.4399, 78.3809) is ~1.17 km
    const distance = haversineDistanceMeters(17.4504, 78.3808, 17.4399, 78.3809);
    assert.ok(distance > 1100 && distance < 1250, `Distance ${distance}m should be ~1.17km`);
  });

  test('should find places within radial radius and sort by nearest first', async () => {
    const repo = new SpatialRepository();
    const originLat = 17.4474;
    const originLng = 78.3762;

    const nearby = await repo.findNearby(originLat, originLng, 3000);
    assert.ok(nearby.length >= 2);
    // Nearest should be Cyber Gateway Tower (distance 0m)
    assert.strictEqual(nearby[0].name, 'Cyber Gateway Tower');
    assert.strictEqual(nearby[0].distanceMeters, 0);

    // Ensure sorted ascending by distance
    for (let i = 1; i < nearby.length; i++) {
      assert.ok(nearby[i].distanceMeters >= nearby[i - 1].distanceMeters);
    }
  });

  test('should find places within a geographic bounding box', async () => {
    const repo = new SpatialRepository();
    const places = await repo.findInBoundingBox(17.40, 78.30, 17.50, 78.45);
    assert.strictEqual(places.length, 5);
  });
});
