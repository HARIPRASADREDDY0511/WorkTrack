
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.task import Task
from app.models.project import Project

from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskResponse
)

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# CREATE TASK
@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):

    project = db.query(Project).filter(
        Project.id == task.project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    new_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        project_id=task.project_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


# GET ALL TASKS
@router.get("/", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):

    return db.query(Task).all()


# GET TASK BY ID
@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


# UPDATE TASK - PUT
@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    updated_data: TaskCreate,
    db: Session = Depends(get_db)
):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    project = db.query(Project).filter(
        Project.id == updated_data.project_id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    task.title = updated_data.title
    task.description = updated_data.description
    task.status = updated_data.status
    task.project_id = updated_data.project_id

    db.commit()
    db.refresh(task)

    return task


# UPDATE TASK - PATCH
@router.patch("/{task_id}", response_model=TaskResponse)
def patch_task(
    task_id: int,
    updated_data: TaskUpdate,
    db: Session = Depends(get_db)
):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_values = updated_data.model_dump(exclude_unset=True)

    for key, value in update_values.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    return task


# DELETE TASK
@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}

@router.get("/filter/status")
def filter_tasks_by_status(
    status: str,
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).filter(
        Task.status == status
    ).all()

    return tasks
