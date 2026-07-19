
from fastapi import FastAPI, status, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from app.core.security import (
    create_access_token,
    get_current_user,
)
from app.database import Base, engine, get_db
from app.schemas.user import UserCreate, UserLogin
from app.repository.user_repository import (
    create_user,
    get_user_by_email,
    authenticate_user,
)
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate
from app.repository.vehicle_repository import (
    create_vehicle,
    get_all_vehicles,
    search_vehicle_by_make,
    purchase_vehicle,
    restock_vehicle,
    update_vehicle,
    delete_vehicle,
)
from app.core.admin import get_current_admin
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    token = create_access_token(
        {"sub": db_user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "is_admin": db_user.is_admin
    }

@app.post("/api/vehicles", status_code=201)
def add_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    new_vehicle = create_vehicle(db, vehicle)

    return {
        "id": new_vehicle.id,
        "make": new_vehicle.make,
        "model": new_vehicle.model,
        "category": new_vehicle.category,
        "price": new_vehicle.price,
        "quantity": new_vehicle.quantity
    }

@app.get("/api/vehicles")
def get_vehicles(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    vehicles = get_all_vehicles(db)

    return [
        {
            "id": vehicle.id,
            "make": vehicle.make,
            "model": vehicle.model,
            "category": vehicle.category,
            "price": vehicle.price,
            "quantity": vehicle.quantity,
        }
        for vehicle in vehicles
    ]

@app.get("/api/vehicles/search")
def search_vehicle(
    make: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    vehicles = search_vehicle_by_make(db, make)

    return [
        {
            "id": v.id,
            "make": v.make,
            "model": v.model,
            "category": v.category,
            "price": v.price,
            "quantity": v.quantity,
        }
        for v in vehicles
    ]

@app.post("/api/vehicles/{vehicle_id}/purchase")
def purchase(
    vehicle_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    vehicle = purchase_vehicle(db, vehicle_id)

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    return {
        "id": vehicle.id,
        "quantity": vehicle.quantity
    }

@app.post("/api/vehicles/{vehicle_id}/restock")
def restock(
    vehicle_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    vehicle = restock_vehicle(db, vehicle_id)

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    return {
        "id": vehicle.id,
        "quantity": vehicle.quantity
    }

@app.put("/api/vehicles/{vehicle_id}")
def update_vehicle_endpoint(
    vehicle_id: int,
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    updated = update_vehicle(db, vehicle_id, vehicle)

    if not updated:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return {
        "id": updated.id,
        "make": updated.make,
        "model": updated.model,
        "category": updated.category,
        "price": updated.price,
        "quantity": updated.quantity,
    }

@app.delete("/api/vehicles/{vehicle_id}")
def delete_vehicle_endpoint(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    deleted = delete_vehicle(db, vehicle_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return {
        "message": "Vehicle deleted successfully"
    }