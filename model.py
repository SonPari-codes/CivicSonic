from sqlalchemy import Column, Integer, String
from geoalchemy2 import Geometry
from database import Base # Importing the master template from your database file

class CrimeIncident(Base):
    __tablename__ = "crime_incidents"

    id = Column(Integer, primary_key=True, index=True)
    crime_type = Column(String, index=True)
    description = Column(String)
    # SRID 4326 treats data as native GPS coordinates (WGS 84 standard)
    location = Column(Geometry(geometry_type='POINT', srid=4326))
