from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.auth.security import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(credentials: LoginRequest):

    if (
        credentials.username == "admin"
        and credentials.password == "samai123"
    ):

        token = create_access_token(
            {
                "sub": credentials.username
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    raise HTTPException(
        status_code=401,
        detail="Credenciales inválidas"
    )