from pydantic import BaseModel

class  SettingCreate(BaseModel):
    cpu_threshold_min: float
    cpu_threshold_max: float
    ram_threshold_min: float
    ram_threshold_max: float
    disk_threshold_min: float
    disk_threshold_max: float
    telegram_chat_id: str
    agent_timeout: float
    telegram_token_id: str