from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class WorkaroundCreate(BaseModel):
    instructions: str


class WorkaroundResponse(BaseModel):
    id: UUID
    incident_id: UUID
    instructions: str
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True