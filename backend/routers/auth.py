from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from database.database import SessionLocal
from schemas.user import UserCreate, UserLogin
from models.users import User
from auth import hash_password, verify_password, create_access_token
from fastapi import HTTPException
import secrets


router=APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username==user.username).first():
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    else:
        agent_token = secrets.token_hex(32)
        hashed=hash_password(user.password)
        new_user=User(username=user.username, password=hashed, agent_token=agent_token)
        db.add(new_user)
        db.commit()
        return {"message": "Usuario creado correctamente", "agent_token": agent_token}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    else:
        if verify_password(user.password,db_user.password):
            return {
                "access_token": create_access_token({"user": db_user.username}),
                "user_id": str(db_user.id),
                "agent_token": db_user.agent_token
            }      
        else:
            raise HTTPException(status_code=401, detail="Contraseña Incorrecta")

        