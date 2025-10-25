-- PostGIS Spatial Schema & GiST Indexing
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to keep PostGIS geometry synced with lat/lng
CREATE OR REPLACE FUNCTION update_places_geom()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geom := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_places_geom_sync
BEFORE INSERT OR UPDATE ON places
FOR EACH ROW
EXECUTE FUNCTION update_places_geom();

-- Spatial GiST Index for fast bounding box and radial queries
CREATE INDEX IF NOT EXISTS idx_places_geom_gist ON places USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_places_category ON places (category);
