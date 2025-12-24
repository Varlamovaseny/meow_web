from fastapi import APIRouter, HTTPException, status, Depends
import jwt
from schemas import UserCreate, UserLogin, UserResponse, Token
from models import User
from sqlalchemy.orm import Session
from database import get_db
from auth import get_password_hash, authenticate_user, create_access_token, create_refresh_token, verify_token

auth_router = APIRouter(prefix="/auth", tags=["authentication"])


@auth_router.post("/register", response_model=UserResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter((User.username == data.username) | (User.email == data.email)).first()
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exist")

    hashed_password = get_password_hash(data.password)
    user = User(username=data.username,
                email=data.email,
                hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@auth_router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, data.username, data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    access_token = create_access_token(data={"user_id": user.id, "username": user.username})
    refresh_token = create_refresh_token(data={"user_id": user.id, "username": user.username})

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@auth_router.post("/token/refresh", response_model=Token)
def refresh_token(data: dict, db: Session = Depends(get_db)):
    try:
        payload = verify_token(data["refresh_token"])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

        user_id: str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

        data = {"user_id": user.id, "username": user.username}
        new_access_token = create_access_token(data)
        new_refresh_token = create_refresh_token(data)

        return {"access_token": new_access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}

    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")