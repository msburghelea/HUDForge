from sqlalchemy import Column, String, DateTime,ForeignKey, FLOAT, TEXT
from sqlalchemy.dialects.postgresql import UUID,ARRAY
from database.database import Base
import uuid
from datetime import datetime

class metric(Base):
    __tablename__="metrics"
    id=Column(UUID(as_uuid=True),primary_key=True, default=uuid.uuid4)
    user_id=Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    cpu=Column(FLOAT, nullable=False)
    ram=Column(FLOAT, nullable=False)
    disk=Column(FLOAT, nullable=False)
    processes=Column(ARRAY(String), nullable=False)
    created_at=Column(DateTime, default=datetime.utcnow)
