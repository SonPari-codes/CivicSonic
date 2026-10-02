# SURAKSHA: Interactive Map for Crime Reporting
<u>**Built by Team CivicSonic (6 members)**</u>

---

## Project Overview & Features
This project is a geographic information system (GIS) designed to report and visualize crime data seamlessly across any device. It utilizes a modular Python backend to validate incoming payloads and serve strict GeoJSON formatting directly to a responsive frontend map.

---

## Tech Stack
| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | HTML, CSS, JavaScript, Leaflet.js |
| **Backend Framework** | Python, FastAPI |
| **Database Engine** | PostgreSQL hosted on Supabase |
| **Spatial Integration** | PostGIS, SQLAlchemy, GeoAlchemy2, Shapely |

---

## Local Setup & Installation
To run the backend application locally, follow these steps:

1. **Configure the Database:** Spin up a cloud database on Supabase and enable the PostGIS extension[cite: 1, 5].
2. **Set Environment Variables:** Create a hidden `.env` file in your root directory and securely store your plain text `DATABASE_URL` string.
3. **Install Dependencies:** Run the following command in your terminal to install the necessary spatial and server libraries:
   ```bash
   python -m pip install fastapi "uvicorn[standard]" sqlalchemy psycopg2-binary geoalchemy2 shapely pydantic python-dotenv
4. **Start the Server:** Launch the ASGI server using the command:
   ```bash
   python -m uvicorn main:app --reload
5. **Test the Endpoints:** Navigate to [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) in your browser to access the built-in Swagger UI to test the data flow before integrating the frontend.
