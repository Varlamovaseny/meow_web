import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { articlesAPI, commentsAPI } from "../api/services";
import { useAuth } from "../context/AuthContext";
import "./ArticleDetail.css";

const ArticleDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await articlesAPI.getById(id);
      setArticle(response.data);
    } catch (err) {
      setError("Article not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getByArticleId(id);
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentsAPI.create({
        content: newComment,
        article_id: parseInt(id),
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      setError("Error adding comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsAPI.delete(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      setError("Error deleting comment");
      console.error("Error:", error)
    }
  };

  const handleDeleteArticle = async () => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      await articlesAPI.delete(id);
      navigate("/articles");
    } catch (err) {
      setError("Error deleting article");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(navigator.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isAuthor = user && user.id === article?.author?.id;
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!article) return <div>Article not found</div>;

  return (
    <div className="article-detail">
      <article className="article-full">
        <header className="article-header">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <span>Category: {article.category}</span>
            <span>Publication date: {formatDate(article.created_at)}</span>
            <span>Author: {article.author?.username}</span>
          </div>
        </header>

        <div className="article-content">
          <p>{article.content}</p>
        </div>

        {isAuthor && (
        <div className="article-actions">
          <Link to={`/articles/${article.id}/edit`} className="edit-btn">
                        Edit
          </Link>
          <button onClick={handleDeleteArticle} className="delete-btn">
            Delete Article
          </button>
        </div>
      )}
      </article>

      <section className="comments-section">
        <h2>Comments ({comments.length})</h2>

        {user ? (
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter your comment..."
              rows="4"
            />
            <button type="submit" className="submit-btn">
              Add comment
            </button>
          </form>
        ) : (
          <p>Sign in to add comment</p>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p>There are no comments yet</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong>{comment.author?.username}</strong>
                  <span>{formatDate(comment.created_at)}</span>
                </div>
                <div className="comment-content">
                  <p>{comment.content}</p>
                </div>
                {user && user.id === comment.author.id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ArticleDetail;
