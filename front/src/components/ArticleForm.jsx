import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ArticleForm.css";

const ArticleForm = ({ article, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        content: article.content || "",
        category: article.category || "",
      });
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Название обязательно";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Содержание обязательно";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Категория обязательна";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      navigate("/articles");
    } catch (error) {
      console.error("Ошибка при сохранении статьи:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="article-form">
      <div className="form-group">
        <label htmlFor="title">Название статьи</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? "error" : ""}
          placeholder="Введите название статьи"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Категория</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={errors.category ? "error" : ""}
          placeholder="Введите категорию"
        />
        {errors.category && (
          <span className="error-text">{errors.category}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="content">Содержание</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="10"
          className={errors.content ? "error" : ""}
          placeholder="Напишите содержание статьи..."
        />
        {errors.content && <span className="error-text">{errors.content}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {article ? "Обновить статью" : "Создать статью"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/articles")}
          className="cancel-btn"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;