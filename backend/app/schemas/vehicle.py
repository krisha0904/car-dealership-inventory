from pydantic import BaseModel


class VehicleCreate(BaseModel):
    make: str
    model: str
    category: str
    price: float
    quantity: int