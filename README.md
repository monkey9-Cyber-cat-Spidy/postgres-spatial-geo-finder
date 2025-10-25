# PostgreSQL PostGIS Spatial Geo Finder

Geospatial indexing microservice and REST API built with Node.js, Express, and PostgreSQL PostGIS. Delivers sub-millisecond radial proximity queries, bounding box spatial filtering, and automated GiST index schemas.

## Features

- **PostGIS GiST Spatial Indexing**: Native geometry indexing on 2D coordinates (`Point, 4326`).
- **Radial Distance Search**: Sub-millisecond queries ordering results from nearest to furthest with exact geodesic meters.
- **Bounding Box Queries**: Filter locations inside arbitrary map viewport polygons.
- **Automated DB Migrations**: Included PL/pgSQL triggers to synchronize geometry columns on insert/update.
- **Docker Compose Topology**: Bundled with official PostGIS 16 image and automated init script volume mounts.

## API Endpoints

### 1. Radial Proximity Search
```http
GET /api/places/nearby?lat=17.4474&lng=78.3762&radiusMeters=5000&category=Tech%20Park
```

### 2. Viewport Bounding Box
```http
POST /api/places/bounding-box
Content-Type: application/json

{
  "minLat": 17.40,
  "minLng": 78.30,
  "maxLat": 17.50,
  "maxLng": 78.45
}
```

### 3. Register Geocoded Place
```http
POST /api/places
Content-Type: application/json

{
  "name": "Hitech City Metro",
  "category": "Transit",
  "lat": 17.4452,
  "lng": 78.3820
}
```

## Testing

```bash
npm test
```
