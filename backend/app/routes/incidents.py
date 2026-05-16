from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import String
from uuid import UUID


from app.database.session import get_db
from app.models.incident import Incident
from app.schemas.incident import (
    IncidentCreate,
    IncidentResponse
)

router = APIRouter(
    prefix="/incidents",
    tags=["Incidents"]
)


@router.post("/", response_model=IncidentResponse)
def create_incident(
    incident: IncidentCreate,
    db: Session = Depends(get_db)
):
    new_incident = Incident(
        title=incident.title,
        incident_type=incident.incident_type,
        description=incident.description,
        severity=incident.severity,
        status=incident.status,
        workaround=incident.workaround
    )

    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)

    return new_incident


@router.get("/", response_model=list[IncidentResponse])
def get_incidents(
    db: Session = Depends(get_db)
):
    incidents = db.query(Incident).all()
    return incidents


@router.put("/{incident_id}/resolve")
def resolve_incident(
    incident_id: UUID,
    db: Session = Depends(get_db)
):
    incident = db.query(Incident).filter(
    Incident.id.cast(String) == str(incident_id)
    ).first()

    if not incident:
        return {
            "error": "Incidente no encontrado"
        }

    incident.status = "RESOLVED"

    db.commit()
    db.refresh(incident)

    return {
        "message": "Incidente resuelto",
        "incident_id": str(incident.id),
        "status": incident.status
    }

    if not incident:
        return {
            "error": "Incidente no encontrado"
        }

    incident.status = "RESOLVED"

    db.commit()

    return {
        "message": "Incidente resuelto"
    }