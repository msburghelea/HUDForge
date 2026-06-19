from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, metrics,settings,logs

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://hud-forge.vercel.app"],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
app.include_router(settings.router, prefix="/settings", tags=["settings"])
app.include_router(logs.router, prefix="/logs", tags=["logs"])
