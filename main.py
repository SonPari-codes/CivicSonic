from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from geoalchemy2.shape import to_shape, from_shape
from shapely.geometry import Point


from database import engine, Base, SessionLocal
from schemas import CrimeCreate, FeatureCollection
from model import CrimeIncident

app = FastAPI()                                             #initialize


app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)                                                       #For html req


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def dbconn():
    Base.metadata.create_all(bind=engine)

@app.on_event("shutdown")
def shutdown():
    engine.dispose()


@app.post("/crime/", status_code=201)
async def report(crime: CrimeCreate, db: Session = Depends(get_db)):
    point = Point(crime.longitude, crime.latitude)
    new_crime = CrimeIncident(
        crime_type=crime.crime_type,
        description=crime.description,
        location=from_shape(point, srid=4326)
    )

    db.add(new_crime)
    db.commit()
    db.refresh(new_crime)

    return {"message": "Crime incident mapped successfully"}

@app.get("/crimes/")
async def get_crimes(db: Session = Depends(get_db)):
    crimes = db.query(CrimeIncident).all()

    features = []

    for crime in crimes:
        point = to_shape(crime.location)
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    point.x,
                    point.y
                ]
            },
            "properties": {
                "id": crime.id,
                "crime_type": crime.crime_type,
                "description": crime.description
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }
