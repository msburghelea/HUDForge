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
from fastapi import WebSocket
import asyncio

class ConnectionManager:
    def __init__(self):
        self.active_connections = {}

    async def connect(self, user_id, websocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id):
        self.active_connections.pop(user_id, None)

    async def send(self, user_id, data):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(data)

manager = ConnectionManager()


router=APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/send")
async def get_metrics(data: MetricCreate, db: Session =Depends(get_db), x_agent_token: str = Header(...) ):
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
    await manager.send(str(db_user.id), data.dict())

    return {"message": "Métricas guardadas correctamente"}




@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()  # mantiene la conexión viva
    except:
        manager.disconnect(user_id)
