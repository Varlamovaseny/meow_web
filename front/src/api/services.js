import api from "./config";

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  refreshToken: (refreshToken) =>
    api.post("/auth/token/refresh", { refresh_token: refreshToken }),
};

export const articlesAPI = {
  getAll: (params = {}) => api.get("/articles/", { params }),
  getById: (id) => api.get(`/articles/${id}`),
  create: (articleData) => api.post("/articles/", articleData),
  update: (id, articleData) => api.put(`/articles/${id}`, articleData),
  delete: (id) => api.delete(`/articles/${id}`),
};

export const commentsAPI = {
  getAll: () => api.get("/comments/"),
  getById: (id) => api.get(`/comments/${id}`),
  getByArticleId: (id) => api.get(`/articles/${id}/comments`),
  create: (commentData) => api.post("/comments/", commentData),
  update: (id, commentData) => api.put(`/comments/${id}`, commentData),
  delete: (id) => api.delete(`/comments/${id}`),
};

export const usersAPI = {
  getAll: () => api.get("/users/"),
  getById: (id) => api.get(`/users/${id}`)
};
