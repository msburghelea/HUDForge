from sqlalchemy import Column, String, DateTime,ForeignKey, TEXT, BOOLEAN
from sqlalchemy.dialects.postgresql import UUID
from database.database import Base
import uuid
from datetime import datetime

class log(Base):
    __tablename__="logs"
    id=Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id=Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type=Column(String,nullable=False)
    message=Column(TEXT,nullable=False)
    created_at=Column(DateTime, default=datetime.utcnow)
