from uuid import UUID
from datetime import datetime

from pydantic import BaseModel


class IncidentUpdateCreate(BaseModel):

    update_type: str
    message: str


class IncidentUpdateResponse(BaseModel):

    id: UUID
    incident_id: UUID
    update_type: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True