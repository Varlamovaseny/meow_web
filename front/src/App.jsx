import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/articles/create"
              element={
                <ProtectedRoute>
                  <CreateArticle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/articles/:id/edit"
              element={
                <ProtectedRoute>
                  <EditArticle />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <div
                  className="error"
                  style={{ textAlign: "center", padding: "4rem" }}
                >
                  <h2>404 - Page not found</h2>
                  <p>Page does not exist.</p>
                </div>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;