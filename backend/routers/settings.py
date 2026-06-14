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
def conf_settings(data: SettingCreate, db: Session = Depends(get_db), authorization: str =  Header(...)):
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=498, detail="Invalid Token")
    db_user = db.query(User).filter(User.username==payload["user"]).first()
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