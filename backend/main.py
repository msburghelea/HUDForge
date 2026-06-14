from fastapi import FastAPI
from routers import auth, metrics,settings

app = FastAPI()
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
app.include_router(settings.router, prefix="/settings", tags=["settings"])

