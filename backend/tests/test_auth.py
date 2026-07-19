from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_user():
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Krisha Patel",
            "email": "krisha@gmail.com",
            "password": "Password123"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Krisha Patel"
    assert data["email"] == "krisha@gmail.com"

    # Password should never be returned
    assert "password" not in data