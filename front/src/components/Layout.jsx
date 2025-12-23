import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";
const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-text">🐱 meow.blog</span>
          </Link>
          <nav className="nav">
            <Link to="/">Главная</Link>
            <Link to="/articles">Статьи</Link>
            {isAuthenticated ? (
              <>
                <Link to="/articles/create">Создать статью</Link>
                <span>Привет, {user.username}!</span>
                <button onClick={handleLogout} className="logout-btn">
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Войти</Link>
                <Link to="/register">Регистрация</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} meow.blog</p>
            <div className="footer-contact">
              <p>Варламова Есения Дмитриевна</p>
              <p>
                <a href="mailto:varlamova.eseny@gmail.com" className="footer-link">
                  varlamova.eseny@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;