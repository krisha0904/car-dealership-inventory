from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate


def create_vehicle(db: Session, vehicle: VehicleCreate):
    db_vehicle = Vehicle(**vehicle.model_dump())

    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)

    return db_vehicle

def get_all_vehicles(db: Session):
    return db.query(Vehicle).all()

def search_vehicle_by_make(db: Session, make: str):
    return db.query(Vehicle).filter(Vehicle.make == make).all()

def purchase_vehicle(db: Session, vehicle_id: int):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    if vehicle and vehicle.quantity > 0:
        vehicle.quantity -= 1
        db.commit()
        db.refresh(vehicle)

    return vehicle

def restock_vehicle(db: Session, vehicle_id: int):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    if vehicle:
        vehicle.quantity += 1
        db.commit()
        db.refresh(vehicle)

    return vehicle

def update_vehicle(db: Session, vehicle_id: int, vehicle_data):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    if not vehicle:
        return None

    vehicle.make = vehicle_data.make
    vehicle.model = vehicle_data.model
    vehicle.category = vehicle_data.category
    vehicle.price = vehicle_data.price
    vehicle.quantity = vehicle_data.quantity

    db.commit()
    db.refresh(vehicle)

    return vehicle

def delete_vehicle(db: Session, vehicle_id: int):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    if not vehicle:
        return False

    db.delete(vehicle)
    db.commit()

    return True