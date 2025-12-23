import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { articlesAPI } from "../api/services";
import ArticleForm from "../components/ArticleForm";
import { useAuth } from "../context/AuthContext";

const EditArticle = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await articlesAPI.getById(id);
      if (response.data.author.id !== user.id) {
        setError("You don't have permissions for editing this article");
        return;
      }
      setArticle(response.data);
    } catch (err) {
      setError("Article not found");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (articleData) => {
    const response = await articlesAPI.update(id, articleData);
    return response.data;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="edit-article">
      <div className="page-header">
        <h1>Edit article</h1>
        <p>Make changes to your article</p>
      </div>

      <ArticleForm article={article} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditArticle;
