import uuid

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_auth_headers():
    email = f"{uuid.uuid4()}@gmail.com"

    # Register user
    client.post(
        "/api/auth/register",
        json={
            "name": "Admin",
            "email": email,
            "password": "Password123"
        }
    )

    # Login user
    response = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": "Password123"
        }
    )

    token = response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }


def test_add_vehicle():

    response = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Fortuner",
            "category": "SUV",
            "price": 4200000,
            "quantity": 5
        },
        headers=get_auth_headers()
    )

    assert response.status_code == 201


def test_get_all_vehicles():

    response = client.get(
        "/api/vehicles",
        headers=get_auth_headers()
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_search_vehicle_by_make():

    client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Fortuner",
            "category": "SUV",
            "price": 4200000,
            "quantity": 5
        },
        headers=get_auth_headers()
    )

    response = client.get(
        "/api/vehicles/search?make=Toyota",
        headers=get_auth_headers()
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) >= 1
    assert data[0]["make"] == "Toyota"


def test_purchase_vehicle():

    create_response = client.post(
        "/api/vehicles",
        json={
            "make": "Honda",
            "model": "City",
            "category": "Sedan",
            "price": 1500000,
            "quantity": 5
        },
        headers=get_auth_headers()
    )

    vehicle_id = create_response.json()["id"]

    response = client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        headers=get_auth_headers()
    )

    assert response.status_code == 200

    data = response.json()

    assert data["quantity"] == 4


def test_restock_vehicle():

    create_response = client.post(
        "/api/vehicles",
        json={
            "make": "BMW",
            "model": "X5",
            "category": "SUV",
            "price": 9000000,
            "quantity": 2
        },
        headers=get_auth_headers()
    )

    vehicle_id = create_response.json()["id"]

    response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=get_auth_headers()
    )

    assert response.status_code == 200

    data = response.json()

    assert data["quantity"] == 3


def test_update_vehicle():

    create_response = client.post(
        "/api/vehicles",
        json={
            "make": "Hyundai",
            "model": "Creta",
            "category": "SUV",
            "price": 1800000,
            "quantity": 5
        },
        headers=get_auth_headers()
    )

    vehicle_id = create_response.json()["id"]

    response = client.put(
        f"/api/vehicles/{vehicle_id}",
        json={
            "make": "Hyundai",
            "model": "Creta SX",
            "category": "SUV",
            "price": 1900000,
            "quantity": 8
        },
        headers=get_auth_headers()
    )

    assert response.status_code == 200

    data = response.json()

    assert data["model"] == "Creta SX"
    assert data["price"] == 1900000
    assert data["quantity"] == 8


def test_delete_vehicle():

    create_response = client.post(
        "/api/vehicles",
        json={
            "make": "Kia",
            "model": "Seltos",
            "category": "SUV",
            "price": 1700000,
            "quantity": 4
        },
        headers=get_auth_headers()
    )

    vehicle_id = create_response.json()["id"]

    response = client.delete(
        f"/api/vehicles/{vehicle_id}",
        headers=get_auth_headers()
    )

    assert response.status_code == 200

    assert response.json() == {
        "message": "Vehicle deleted successfully"
    }