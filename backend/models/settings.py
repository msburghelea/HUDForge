from sqlalchemy import Column, String, DateTime,ForeignKey, FLOAT, TEXT
from sqlalchemy.dialects.postgresql import UUID
from database.database import Base
import uuid
from datetime import datetime

class Setting(Base):
    __tablename__="settings"
    id=Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id=Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    cpu_threshold_min=Column(FLOAT, nullable=False)
    cpu_threshold_max=Column(FLOAT, nullable=False)
    ram_threshold_min=Column(FLOAT, nullable=False)
    ram_threshold_max=Column(FLOAT, nullable=False)
    disk_threshold_min=Column(FLOAT, nullable=False)
    disk_threshold_max=Column(FLOAT, nullable=False)
    telegram_chat_id=Column(String, nullable=False)
    agent_timeout=Column(FLOAT, nullable=False)
    telegram_token_id=Column(String, nullable=False)
    
    