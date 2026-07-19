from fastapi import FastAPI, status, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import Base, engine, get_db
from app.repository.user_repository import create_user
from app.schemas.user import UserCreate

Base.metadata.create_all(bind=engine)

app = FastAPI()

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    

@app.get("/")
def health_check():
    return {"message": "Car Dealership Inventory API"}


@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    new_user = create_user(db, user)

    return {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }
