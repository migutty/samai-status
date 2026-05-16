from uuid import UUID

from pydantic import BaseModel

from datetime import datetime

from app.schemas.incident_update import (
    IncidentUpdateResponse
)


class IncidentCreate(BaseModel):
    title: str
    incident_type: str
    description: str
    severity: str
    status: str
    workaround: str | None = None
    estimated_resolution: datetime | None = None


class IncidentResponse(BaseModel):

    id: UUID
    title: str
    incident_type: str
    description: str
    severity: str
    status: str
    workaround: str | None
    estimated_resolution: datetime | None

    updates: list[IncidentUpdateResponse] = []

    class Config:
        from_attributes = True