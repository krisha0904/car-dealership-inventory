from fastapi import FastAPI, status
from pydantic import BaseModel
from app.database import Base, engine
from app.models.user import User

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
def register_user():
    return {
        "message": "User registered successfully"
    }
    