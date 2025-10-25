// Spatial calculations and database abstraction
export function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export class SpatialRepository {
  constructor(pool = null) {
    this.pool = pool;
    this.inMemoryPlaces = [
      { id: '1', name: 'Cyber Gateway Tower', category: 'Tech Park', lat: 17.4474, lng: 78.3762 },
      { id: '2', name: 'Mindspace Hub', category: 'Tech Park', lat: 17.4399, lng: 78.3809 },
      { id: '3', name: 'Financial District Plaza', category: 'Finance', lat: 17.4156, lng: 78.3427 },
      { id: '4', name: 'Jubilee Hills Coworking', category: 'Coworking', lat: 17.4319, lng: 78.4073 },
      { id: '5', name: 'Gachibowli Stadium Center', category: 'Sports', lat: 17.4418, lng: 78.3498 }
    ];
  }

  async addPlace(place) {
    const item = {
      id: place.id || String(Date.now()),
      name: place.name,
      category: place.category || 'General',
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lng)
    };
    this.inMemoryPlaces.push(item);
    return item;
  }

  async findNearby(lat, lng, radiusMeters, category = null) {
    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const radius = parseFloat(radiusMeters);

    return this.inMemoryPlaces
      .filter(p => !category || p.category.toLowerCase() === category.toLowerCase())
      .map(p => {
        const distance = haversineDistanceMeters(centerLat, centerLng, p.lat, p.lng);
        return { ...p, distanceMeters: distance };
      })
      .filter(p => p.distanceMeters <= radius)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }

  async findInBoundingBox(minLat, minLng, maxLat, maxLng) {
    return this.inMemoryPlaces.filter(p => 
      p.lat >= parseFloat(minLat) &&
      p.lat <= parseFloat(maxLat) &&
      p.lng >= parseFloat(minLng) &&
      p.lng <= parseFloat(maxLng)
    );
  }
}

export const defaultSpatialRepo = new SpatialRepository();
