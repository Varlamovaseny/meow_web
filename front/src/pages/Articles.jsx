import React, { useState, useEffect } from "react";
import { articlesAPI } from "../api/services";
import ArticleCard from "../components/ArticleCard";
import "./Articles.css";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    sort: "date_desc",
  });
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  const fetchArticles = async () => {
    try {
      const response = await articlesAPI.getAll(filters);
      setArticles(response.data);
    } catch (err) {
      setError("Ошибка загрузки статей");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      category: searchInput.trim()
    }));
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setFilters({
      category: "",
      sort: "date_desc"
    });
  };

  const handleSortChange = (value) => {
    setFilters(prev => ({
      ...prev,
      sort: value
    }));
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await articlesAPI.delete(articleId);
      setArticles(articles.filter((article) => article.id !== articleId));
    } catch (err) {
      setError("Ошибка удаления статьи");
    }
  };

  const hasActiveFilters = filters.category !== "";

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="articles-page">
      <div className="page-header">
        <h1>Все статьи</h1>
        <p>Исследуйте нашу коллекцию статей</p>
      </div>

      <div className="filters">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-group">
            <label htmlFor="category-search">Поиск по категории:</label>
            <div className="search-input-container">
              <input
                id="category-search"
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Введите название категории..."
                className="search-input"
              />
              <button type="submit" className="search-button">
                Найти
              </button>
            </div>
            {filters.category && (
              <div className="active-filter">
                Показана категория: <strong>{filters.category}</strong>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="clear-filter"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </form>

        <div className="filter-group">
          <label htmlFor="sort">Сортировать по дате:</label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="date_desc">Сначала новые</option>
            <option value="date_asc">Сначала старые</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="clear-all-filters"
          >
            Очистить все фильтры
          </button>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      <div className="articles-list">
        {articles.length === 0 ? (
          <div className="no-articles">
            <h3>Статьи не найдены</h3>
            <p>
              {filters.category
                ? `Не найдено статей в категории "${filters.category}"`
                : "Пока нет доступных статей"
              }
            </p>
            {filters.category && (
              <button onClick={handleClearFilters} className="clear-search">
                Показать все статьи
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="articles-count">
              Найдено {articles.length} стать{articles.length === 1 ? 'я' : articles.length > 1 && articles.length < 5 ? 'и' : 'ей'}
              {filters.category && ` в категории "${filters.category}"`}
              {!filters.category && ` (отсортировано по ${filters.sort === 'date_desc' ? 'новым' : 'старым'})`}
            </div>
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onDelete={handleDeleteArticle}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Articles;