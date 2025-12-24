from fastapi import APIRouter, Query, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List
from schemas import ArticleResponse, ArticleCreate, ArticleUpdate, CommentResponse
from models import Article, User
from database import get_db
from auth import get_current_user

article_router = APIRouter(prefix="/articles", tags=["articles"])


@article_router.get("/", response_model=List[ArticleResponse])
def get_articles(category: Optional[str] = Query(None, description="Filter by category"),
                 sort: Optional[str] = Query(None, description="Sort by date (asc/desc)"),
                 db: Session = Depends(get_db)):
    query = db.query(Article)

    if category:
        query = query.filter(Article.category == category)

    if sort == "date_desc":
        query = query.order_by(Article.created_at.desc())
    elif sort == "date_asc":
        query = query.order_by(Article.created_at.asc())

    return query.all()


@article_router.get("/{article_id}", response_model=ArticleResponse)
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    return article


@article_router.post("/", response_model=ArticleResponse)
def create_article(data: ArticleCreate,
                   db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    new_article = Article(title=data.title, content=data.content,
                          category=data.category, author_id=current_user.id)
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    return new_article


@article_router.get("/{article_id}/comments", response_model=List[CommentResponse])
def get_article_comments(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    return article.comments


@article_router.put("/{article_id}", response_model=ArticleResponse)
def update_article(article_id: int, data: ArticleUpdate,
                   db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    updated_article = db.query(Article).filter(Article.id == article_id).first()
    if not updated_article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    if updated_article.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No permissions")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(updated_article, field, value)

    db.commit()
    db.refresh(updated_article)
    return updated_article


@article_router.delete("/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    if article.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No permissions")

    db.delete(article)
    db.commit()
    return {"message": "Article deleted"}