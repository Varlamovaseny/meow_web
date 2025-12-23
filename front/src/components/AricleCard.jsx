import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ArticleCard.css";

const ArticleCard = ({ article, onDelete }) => {
  const { user } = useAuth();
  const isAuthor = user && user.id === article.author.id;

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить эту статью?")) {
      await onDelete(article.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="article-card">
      <div className="article-header">
        <h2>
          <Link to={`/articles/${article.id}`}>{article.title}</Link>
        </h2>
        <div className="article-meta">
          <span>Категория: {article.category}</span>
          <span>Дата: {formatDate(article.created_at)}</span>
          <span>Автор: {article.author?.username}</span>
        </div>
      </div>
      <div className="article-content">
        <p>{article.content.substring(0, 200)}...</p>
      </div>
      <div className="article-actions">
        <Link to={`/articles/${article.id}`} className="read-more">
          Читать далее
        </Link>
        {isAuthor && (
          <div className="author-actions">
            <Link to={`/articles/${article.id}/edit`} className="edit-btn">
              Редактировать
            </Link>
            <button onClick={handleDelete} className="delete-btn">
              Удалить
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;