from fastapi import FastAPI, status, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.schemas.user import UserCreate, UserLogin
from app.repository.user_repository import (
    create_user,
    get_user_by_email,
    authenticate_user,
)

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def health_check():
    return {"message": "Car Dealership Inventory API"}


@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    # Check if email already exists
    existing_user = get_user_by_email(db, user.email)

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already exists"
        )

    # Create new user
    new_user = create_user(db, user)

    return {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }

@app.post("/api/auth/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    db_user = authenticate_user(db, user.email, user.password)

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful"
    }