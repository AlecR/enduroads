from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.database import engine
from models.base import Base
from models.user import User
from routers import auth_router, strava_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router.router)
app.include_router(strava_router.router)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}
    