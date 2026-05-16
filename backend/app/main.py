from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.session import engine
from app.database.session import Base

from app.models.incident import Incident
from app.models.timeline import Timeline

from app.routes.incident import router as incident_router
from app.routes.auth import router as auth_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incident_router)
app.include_router(auth_router)

@app.get("/")
def home():
    return {
        "message": "SAMAI Status API funcionando"
    }