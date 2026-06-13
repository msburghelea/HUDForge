from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from database.database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__="users"
    id=Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username=Column(String, nullable=False)
    password=Column(String, nullable=False)
    role=Column(String, default="user")
    created_at = Column(DateTime, default=datetime.utcnow)
    agent_token=Column(String, nullable=False, unique=True)


