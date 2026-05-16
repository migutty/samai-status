from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

from app.database.connection import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    title = Column(String, nullable=False)

    incident_type = Column(String, nullable=False)

    description = Column(Text, nullable=False)

    severity = Column(String, nullable=False)

    status = Column(String, nullable=False)

    workaround = Column(Text)

    started_at = Column(DateTime, default=datetime.utcnow)

    resolved_at = Column(DateTime)

    created_at = Column(DateTime, default=datetime.utcnow)