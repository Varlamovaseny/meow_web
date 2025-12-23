import React from "react";
import { articlesAPI } from "../api/services";
import ArticleForm from "../components/ArticleForm";

const CreateArticle = () => {
  const handleSubmit = async (articleData) => {
    const response = await articlesAPI.create(articleData);
    return response.data;
  };

  return (
    <div className="create-article">
      <div className="page-header">
        <h1>Create new article</h1>
        <p>Share your ideas with people!</p>
      </div>

      <ArticleForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateArticle;
