from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(min_length=2, max_length=50)
    email: EmailStr = Field(max_length=100)
    password: str = Field(min_length=1, max_length=255)

class UserLogin(BaseModel):
    username: str = Field(min_length=2, max_length=50)
    password: str = Field(min_length=1, max_length=255)

class UserResponse(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class ArticleCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1)
    category: str

class ArticleUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = None

class ArticleResponse(BaseModel):
    id: int
    title: str
    content: str
    category: str
    created_at: datetime
    author : UserResponse

    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    content: str = Field(min_length=1)
    article_id: int

class CommentUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1)

class CommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    article_id: int
    author: UserResponse

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str