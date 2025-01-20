module.exports = { buildRadiusQuery: (lat, lng, r) => `ST_DWithin(geom, ST_MakePoint(${lng}, ${lat})::geography, ${r})` };
