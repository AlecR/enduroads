from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey
import uuid

from .base import Base

class StravaConnection(Base):
    __tablename__ = "strava_connections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = relationship(UUID(as_uuid=True), ForeignKey('user.id'))
    athlete_id = Column(String)
    access_token = Column(String)
    refresh_token = Column(String)
