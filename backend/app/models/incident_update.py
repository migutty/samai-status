from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.database.connection import Base


class IncidentUpdate(Base):
    __tablename__ = "incident_updates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    incident_id = Column(
        UUID(as_uuid=True),
        ForeignKey("incidents.id"),
        nullable=False
    )

    update_type = Column(String, nullable=False)

    message = Column(Text, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)