from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.incident_update import IncidentUpdate
from app.auth.security import verify_token
from app.schemas.incident_update import (
    IncidentUpdateCreate,
    IncidentUpdateResponse
)

router = APIRouter(
    prefix="/incidents",
    tags=["Incident Updates"]
)


@router.post(
    "/{incident_id}/updates",
    response_model=IncidentUpdateResponse
)
def create_update(
    incident_id: UUID,
    update: IncidentUpdateCreate,
    db: Session = Depends(get_db),
    user: str = Depends(verify_token)
):

    new_update = IncidentUpdate(
        incident_id=incident_id,
        update_type=update.update_type,
        message=update.message
    )

    db.add(new_update)
    db.commit()
    db.refresh(new_update)

    return new_update


@router.get("/{incident_id}/updates")
def get_updates(
    incident_id: UUID,
    db: Session = Depends(get_db)
):

    updates = db.query(IncidentUpdate).filter(
        IncidentUpdate.incident_id == incident_id
    ).order_by(
        IncidentUpdate.created_at.desc()
    ).all()

    return updates