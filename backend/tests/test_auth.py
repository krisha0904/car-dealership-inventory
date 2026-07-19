from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_user():
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Krisha Patel",
            "email": "krisha1@gmail.com",
            "password": "Password123"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Krisha Patel"
    assert data["email"] == "krisha1@gmail.com"

    # Password should never be returned
    assert "password" not in data

def test_register_duplicate_email():
    user = {
        "name": "Krisha Patel",
        "email": "krisha@gmail.com",
        "password": "Password123"
    }

    # First registration
    client.post("/api/auth/register", json=user)

    # Second registration with same email
    response = client.post("/api/auth/register", json=user)

    assert response.status_code == 409
    assert response.json() == {
        "detail": "Email already exists"
    }

def test_login_user():
    user = {
        "name": "Krisha Patel",
        "email": "krisha@gmail.com",
        "password": "Password123"
    }

    # Register user
    client.post("/api/auth/register", json=user)

    # Login
    response = client.post(
        "/api/auth/login",
        json={
            "email": "krisha@gmail.com",
            "password": "Password123"
        }
    )

    assert response.status_code == 200