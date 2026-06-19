from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from fastapi import Depends
from database.database import SessionLocal
from fastapi import Header
from models.users import User
from models.settings import Setting
from schemas.settings import SettingCreate
from auth import verify_token

router=APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/settings")
def conf_settings(data: SettingCreate, db: Session = Depends(get_db), authorization: str = Header(...)):
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=498, detail="Invalid Token")
    db_user = db.query(User).filter(User.username == payload["user"]).first()
    
    existing = db.query(Setting).filter(Setting.user_id == db_user.id).first()
    
    if existing:
        existing.cpu_threshold_min = data.cpu_threshold_min
        existing.cpu_threshold_max = data.cpu_threshold_max
        existing.ram_threshold_min = data.ram_threshold_min
        existing.ram_threshold_max = data.ram_threshold_max
        existing.disk_threshold_min = data.disk_threshold_min
        existing.disk_threshold_max = data.disk_threshold_max
        existing.telegram_chat_id = data.telegram_chat_id
        existing.agent_timeout = data.agent_timeout
        existing.telegram_token_id = data.telegram_token_id
        db.commit()
    else:
        new_setting = Setting(
            user_id=db_user.id,
            cpu_threshold_min=data.cpu_threshold_min,
            cpu_threshold_max=data.cpu_threshold_max,
            ram_threshold_min=data.ram_threshold_min,
            ram_threshold_max=data.ram_threshold_max,
            disk_threshold_min=data.disk_threshold_min,
            disk_threshold_max=data.disk_threshold_max,
            telegram_chat_id=data.telegram_chat_id,
            agent_timeout=data.agent_timeout,
            telegram_token_id=data.telegram_token_id
        )
        db.add(new_setting)
        db.commit()
    
    return {"message": "Settings Saved"}

@router.get("/settings")
def get_settings(db: Session = Depends(get_db), authorization: str = Header(...)):
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=498, detail="Invalid Token")
    db_user = db.query(User).filter(User.username == payload["user"]).first()
    config = db.query(Setting).filter(Setting.user_id == db_user.id).first()
    if not config:
        return None
    return {
        "cpu_threshold_min": config.cpu_threshold_min,
        "cpu_threshold_max": config.cpu_threshold_max,
        "ram_threshold_min": config.ram_threshold_min,
        "ram_threshold_max": config.ram_threshold_max,
        "disk_threshold_min": config.disk_threshold_min,
        "disk_threshold_max": config.disk_threshold_max,
        "telegram_chat_id": config.telegram_chat_id,
        "telegram_token_id": config.telegram_token_id,
        "agent_timeout": config.agent_timeout
    }