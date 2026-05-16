from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.database.session import get_db
from app.models.incident_update import IncidentUpdate
from app.schemas.incident_update import (
    IncidentUpdateCreate,
    IncidentUpdateResponse
)

router = APIRouter(
    prefix="/incidents",
    tags=["Incident Updates"]
)


@router.post("/{incident_id}/updates")
def create_update(
    incident_id: UUID,
    data: IncidentUpdateCreate,
    db: Session = Depends(get_db)
):

    update = IncidentUpdate(
        incident_id=incident_id,
        update_type=data.update_type,
        message=data.message
    )

    db.add(update)

    db.commit()

    db.refresh(update)

    return update


@router.get(
    "/{incident_id}/updates",
    response_model=list[IncidentUpdateResponse]
)
def get_updates(
    incident_id: UUID,
    db: Session = Depends(get_db)
):

    updates = db.query(
        IncidentUpdate
    ).filter(
        IncidentUpdate.incident_id == incident_id
    ).all()

    return updates