
from fastapi import FastAPI
from sqlalchemy import text
from app.models.task import Task
from app.routers.tasks import router as task_router
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models.project import Project
from app.routers.projects import router as project_router

app = FastAPI(
    title="WorkTrack API",
    description="Project and Task Management System",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(project_router)
app.include_router(task_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to WorkTrack API",
        "status": "Backend is running successfully"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/db-check")
def database_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "message": "PostgreSQL connected successfully"
    }
