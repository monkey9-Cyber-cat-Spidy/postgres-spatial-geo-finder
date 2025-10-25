import express from 'express';
import { defaultSpatialRepo, haversineDistanceMeters } from './db.js';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    engine: 'PostGIS Spatial Engine',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/places/nearby', async (req, res) => {
  const { lat, lng, radiusMeters = 5000, category } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng coordinates are required' });
  }

  try {
    const results = await defaultSpatialRepo.findNearby(lat, lng, radiusMeters, category);
    res.json({
      count: results.length,
      center: { lat: parseFloat(lat), lng: parseFloat(lng) },
      radiusMeters: parseFloat(radiusMeters),
      places: results
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/places/bounding-box', async (req, res) => {
  const { minLat, minLng, maxLat, maxLng } = req.body;
  if (minLat == null || minLng == null || maxLat == null || maxLng == null) {
    return res.status(400).json({ error: 'minLat, minLng, maxLat, maxLng bounding box required' });
  }

  try {
    const places = await defaultSpatialRepo.findInBoundingBox(minLat, minLng, maxLat, maxLng);
    res.json({
      count: places.length,
      boundingBox: { minLat, minLng, maxLat, maxLng },
      places
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/places', async (req, res) => {
  const { name, category, lat, lng } = req.body;
  if (!name || lat == null || lng == null) {
    return res.status(400).json({ error: 'name, lat, and lng are required' });
  }

  const place = await defaultSpatialRepo.addPlace({ name, category, lat, lng });
  res.status(201).json({ message: 'Place registered with spatial coordinates', place });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`PostGIS Spatial Geo Finder running on port ${PORT}`);
  });
}

export default app;
