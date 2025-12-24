from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from auth_endpoints import auth_router
from comments_endpoints import comment_router
from article_endpoints import article_router
from user_endpoints import user_router
from database import create_tables

app = FastAPI()
create_tables()

app.include_router(article_router)
app.include_router(comment_router)
app.include_router(auth_router)
app.include_router(user_router)

app.add_middleware(
    CORSMiddleware,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
)


@app.get("/")
def get_root():
    html_content = "<h2>API включено</h2>"
    return HTMLResponse(content=html_content)