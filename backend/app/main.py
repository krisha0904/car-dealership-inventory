from fastapi import FastAPI, status

app = FastAPI()


@app.get("/")
def health_check():
    return {
        "message": "Car Dealership Inventory API"
    }

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register_user():
    return {
        "message": "User registered successfully"
    }