from fastapi import APIRouter
from fastapi import APIRouter, Query, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from schemas import CommentResponse, CommentCreate, CommentUpdate
from models import Comment, Article, User
from database import get_db
from auth import get_current_user

comment_router = APIRouter(prefix="/comments", tags=["comments"])


@comment_router.get("/", response_model=List[CommentResponse])
def get_comments(db: Session = Depends(get_db)):
    return db.query(Comment).all()


@comment_router.get("/{comment_id}", response_model=CommentResponse)
def get_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    return comment


@comment_router.post("/", response_model=CommentResponse)
def create_comment(data: CommentCreate, db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    article = db.query(Article).filter(Article.id == data.article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    new_comment = Comment(content=data.content, author_id=current_user.id,
                          article_id=data.article_id)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment


@comment_router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(comment_id: int, data: CommentUpdate,
                   db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    updated_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not updated_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")

    if updated_comment.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No permissions")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(updated_comment, field, value)

    db.commit()
    db.refresh(updated_comment)
    return updated_comment


@comment_router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")

    if comment.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No permissions")

    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}