from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from schemas.metrics import MetricCreate
from models.metrics import metric
from fastapi import HTTPException
from database.database import SessionLocal
from fastapi import Header
from models.users import User
from utils.alerts import check_alerts
from models.logs import log

router=APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/send")
def get_metrics(data: MetricCreate, db: Session =Depends(get_db), x_agent_token: str = Header(...) ):
    db_user = db.query(User).filter(User.agent_token == x_agent_token).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Token inválido")
    new_metric=metric(user_id=db_user.id, cpu=data.cpu, ram=data.ram, disk=data.disk, processes=data.processes)
    db.add(new_metric)
    db.commit()
    db.refresh(new_metric)
    new_log = log(user_id=db_user.id, type="INFO", message="Métricas recibidas")
    db.add(new_log)
    db.commit()
    check_alerts(db_user.id, data, new_metric.id, db)
    return {"message": "Métricas guardadas correctamente"}


