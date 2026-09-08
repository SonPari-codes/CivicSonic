from pydantic import BaseModel
from typing import List, Dict, Any

class CrimeCreate(BaseModel):
    crime_type: str
    description: str
    latitude: float
    longitude: float

# Required to structure the GeoJSON response for Leaflet
class FeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[Dict[str, Any]]
