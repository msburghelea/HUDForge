from fastapi import APIRouter, HTTPException, Header, Depends
from sqlalchemy.orm import Session
from database.database import SessionLocal
from models.logs import log
from models.users import User
from auth import verify_token
from typing import Optional

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/logs")
def get_logs(
    db: Session = Depends(get_db),
    authorization: str = Header(...),
    page: int = 1,
    type: Optional[str] = None
):
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=498, detail="Invalid Token")
    db_user = db.query(User).filter(User.username == payload["user"]).first()
    
    query = db.query(log).filter(log.user_id == db_user.id)
    
    if type:
        query = query.filter(log.type == type)
    
    total = query.count()
    logs = query.order_by(log.created_at.desc()).offset((page - 1) * 20).limit(20).all()
    
    return {
        "total": total,
        "page": page,
        "pages": (total + 19) // 20,
        "logs": [
            {
                "id": str(l.id),
                "type": l.type,
                "message": l.message,
                "created_at": l.created_at.isoformat()
            }
            for l in logs
        ]
    }