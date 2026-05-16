from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.session import engine, Base

from app.models.incident import Incident
from app.models.incident_update import IncidentUpdate
from app.models.workaround import Workaround

from app.routes.incidents import router as incidents_router
from app.routes.incident_updates import router as updates_router
from app.routes.workarounds import router as workarounds_router
from app.routes.auth import router as auth_router


app = FastAPI(
    title="SAMAI Status API",
    description="Sistema de alertas operativas SAMAI",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incidents_router)
app.include_router(updates_router)
app.include_router(workarounds_router)
app.include_router(auth_router)


@app.get("/")
def home():

    return {
        "message": "SAMAI Status API funcionando"
    }