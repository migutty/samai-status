from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.workaround import Workaround

from app.schemas.workaround import (
    WorkaroundCreate,
    WorkaroundResponse
)

router = APIRouter(
    prefix="/incidents",
    tags=["Workarounds"]
)


@router.post(
    "/{incident_id}/workarounds",
    response_model=WorkaroundResponse
)
def create_workaround(
    incident_id: str,
    workaround: WorkaroundCreate,
    db: Session = Depends(get_db)
):
    new_workaround = Workaround(
        incident_id=incident_id,
        instructions=workaround.instructions
    )

    db.add(new_workaround)
    db.commit()
    db.refresh(new_workaround)

    return new_workaround


@router.get(
    "/{incident_id}/workarounds",
    response_model=list[WorkaroundResponse]
)
def get_workarounds(
    incident_id: str,
    db: Session = Depends(get_db)
):
    workarounds = db.query(Workaround).filter(
        Workaround.incident_id == incident_id
    ).all()

    return workarounds