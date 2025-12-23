
document.addEventListener('DOMContentLoaded', function() {

    if (document.getElementById('app')) {
        const app = new Vue({
            el: '#app',
            data: {
                user: null,
                loginForm: {
                    email: '',
                    password: '',
                    remember: false
                },
                registerForm: {
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                },
                commentForm: {
                    text: ''
                },
                articleForm: {
                    title: '',
                    content: '',
                    image_url: ''
                },
                loading: false,
                message: null,
                messageType: 'info',
                articles: [],
                currentArticle: null,
                comments: [],
                currentPage: 'home'
            },
            computed: {
                isAuthenticated() {
                    return this.user !== null;
                },
                isAdmin() {
                    return this.user && this.user.is_admin;
                },
                registerValid() {
                    return this.registerForm.username &&
                           this.registerForm.email &&
                           this.registerForm.password &&
                           this.registerForm.password === this.registerForm.confirmPassword;
                },
                loginValid() {
                    return this.loginForm.email && this.loginForm.password;
                },
                commentValid() {
                    return this.commentForm.text.trim().length > 0;
                },
                articleValid() {
                    return this.articleForm.title && this.articleForm.content;
                }
            },
            created() {
                this.loadUserData();
                if (this.currentPage === 'news' || this.currentPage === 'home') {
                    this.loadArticles();
                }
            },
            methods: {
                loadUserData() {
                    const userData = sessionStorage.getItem('meowBlogUser');
                    if (userData) {
                        this.user = JSON.parse(userData);
                    }
                },

                saveUserData(userData) {
                    this.user = userData;
                    sessionStorage.setItem('meowBlogUser', JSON.stringify(userData));
                },

                clearUserData() {
                    this.user = null;
                    sessionStorage.removeItem('meowBlogUser');
                },

                showMessage(text, type = 'info') {
                    this.message = text;
                    this.messageType = type;
                    setTimeout(() => {
                        this.message = null;
                    }, 5000);
                },

                async loadArticles() {
                    try {
                        this.loading = true;
                    } catch (error) {
                        this.showMessage('Ошибка загрузки статей', 'error');
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                },

                async loadArticle(id) {
                    try {
                        this.loading = true;
                        // const response = await fetch(`/api/articles/${id}`);
                        // this.currentArticle = await response.json();

                        this.currentArticle = {
                            id: id,
                            title: 'Кошки в истории человечества',
                            content: `<p>Кошки сопровождают человека уже более 9 500 лет. Первые свидетельства одомашнивания кошек были найдены на Кипре, где археологи обнаружили захоронение человека вместе с котенком, датируемое 7500 годом до н.э.</p>
                                     <p>В Древнем Египте кошки считались священными животными. Богиня Бастет, покровительница домашнего очага, плодородия и любви, изображалась в виде женщины с головой кошки. Убийство кошки каралось смертной казнью.</p>
                                     <p>В Средневековой Европе кошки, особенно черные, стали ассоциироваться с колдовством и темными силами. Это привело к массовому истреблению кошек, что, по мнению историков, способствовало распространению чумы, так как крысы размножались бесконтрольно.</p>
                                     <p>Сегодня кошки - самые популярные домашние животные в мире. По оценкам, в мире насчитывается более 600 миллионов домашних кошек.</p>`,
                            author: 'Мурзик',
                            date: '2024-03-15',
                            image_url: 'https://images.unsplash.com/photo-1514888286974-6d03bdeacba8?w=800&h=400&fit=crop'
                        };

                        await this.loadComments(id);
                        this.currentPage = 'article';
                    } catch (error) {
                        this.showMessage('Ошибка загрузки статьи', 'error');
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                },

                async loadComments(articleId) {
                    try {
                        this.comments = [
                            {
                                id: 1,
                                author: 'Котофей',
                                text: 'Отличная статья! Очень познавательно.',
                                date: '2024-03-15 14:30'
                            },
                            {
                                id: 2,
                                author: 'Мурка',
                                text: 'Я не знала, что кошки так давно с нами! Спасибо за интересную информацию.',
                                date: '2024-03-15 16:45'
                            }
                        ];
                    } catch (error) {
                        console.error('Ошибка загрузки комментариев:', error);
                    }
                },

                async login() {
                    if (!this.loginValid) {
                        this.showMessage('Заполните все поля', 'error');
                        return;
                    }

                    try {
                        this.loading = true;
                        // Здесь будет запрос к вашему бэкенду
                        // const response = await fetch('/api/login', {
                        //     method: 'POST',
                        //     headers: {'Content-Type': 'application/json'},
                        //     body: JSON.stringify(this.loginForm)
                        // });

                        setTimeout(() => {
                            const mockUser = {
                                id: 1,
                                name: 'Кот Ученый',
                                email: this.loginForm.email,
                                is_admin: false
                            };

                            this.saveUserData(mockUser);
                            this.showMessage('Вход выполнен успешно!', 'success');
                            this.loginForm = { email: '', password: '', remember: false };

                            // Перенаправляем на главную
                            this.currentPage = 'home';
                        }, 500);

                    } catch (error) {
                        this.showMessage('Ошибка входа: ' + error.message, 'error');
                    } finally {
                        this.loading = false;
                    }
                },

                // Регистрация пользователя
                async register() {
                    if (!this.registerValid) {
                        this.showMessage('Проверьте правильность заполнения всех полей', 'error');
                        return;
                    }

                    if (this.registerForm.password !== this.registerForm.confirmPassword) {
                        this.showMessage('Пароли не совпадают', 'error');
                        return;
                    }

                    try {
                        this.loading = true;
                        // Здесь будет запрос к вашему бэкенду
                        // const response = await fetch('/api/register', {
                        //     method: 'POST',
                        //     headers: {'Content-Type': 'application/json'},
                        //     body: JSON.stringify(this.registerForm)
                        // });

                        // Имитация ответа сервера
                        setTimeout(() => {
                            const mockUser = {
                                id: 2,
                                name: this.registerForm.username,
                                email: this.registerForm.email,
                                is_admin: false
                            };

                            this.saveUserData(mockUser);
                            this.showMessage('Регистрация прошла успешно!', 'success');
                            this.registerForm = { username: '', email: '', password: '', confirmPassword: '' };

                            // Перенаправляем на главную
                            this.currentPage = 'home';
                        }, 500);

                    } catch (error) {
                        this.showMessage('Ошибка регистрации: ' + error.message, 'error');
                    } finally {
                        this.loading = false;
                    }
                },

                // Выход пользователя
                logout() {
                    this.clearUserData();
                    this.showMessage('Вы вышли из системы', 'info');
                    this.currentPage = 'home';
                },

                // Отправка комментария
                async submitComment() {
                    if (!this.isAuthenticated) {
                        this.showMessage('Войдите, чтобы оставить комментарий', 'error');
                        return;
                    }

                    if (!this.commentValid) {
                        this.showMessage('Введите текст комментария', 'error');
                        return;
                    }

                    try {
                        // Здесь будет запрос к вашему бэкенду
                        // const response = await fetch('/api/comments', {
                        //     method: 'POST',
                        //     headers: {'Content-Type': 'application/json'},
                        //     body: JSON.stringify({
                        //         article_id: this.currentArticle.id,
                        //         text: this.commentForm.text
                        //     })
                        // });

                        // Имитация ответа сервера
                        const newComment = {
                            id: this.comments.length + 1,
                            author: this.user.name,
                            text: this.commentForm.text,
                            date: new Date().toISOString()
                        };

                        this.comments.unshift(newComment);
                        this.commentForm.text = '';
                        this.showMessage('Комментарий добавлен!', 'success');

                    } catch (error) {
                        this.showMessage('Ошибка отправки комментария', 'error');
                        console.error(error);
                    }
                },

                // Создание статьи
                async createArticle() {
                    if (!this.isAuthenticated) {
                        this.showMessage('Войдите, чтобы создать статью', 'error');
                        return;
                    }

                    if (!this.articleValid) {
                        this.showMessage('Заполните заголовок и содержание статьи', 'error');
                        return;
                    }

                    try {
                        this.loading = true;
                        // Здесь будет запрос к вашему бэкенду
                        // const response = await fetch('/api/articles', {
                        //     method: 'POST',
                        //     headers: {'Content-Type': 'application/json'},
                        //     body: JSON.stringify(this.articleForm)
                        // });

                        // Имитация ответа сервера
                        setTimeout(() => {
                            const newArticle = {
                                id: this.articles.length + 1,
                                title: this.articleForm.title,
                                excerpt: this.articleForm.content.substring(0, 150) + '...',
                                author: this.user.name,
                                date: new Date().toISOString().split('T')[0],
                                image_url: this.articleForm.image_url || 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=200&fit=crop'
                            };

                            this.articles.unshift(newArticle);
                            this.articleForm = { title: '', content: '', image_url: '' };
                            this.showMessage('Статья успешно создана!', 'success');
                            this.currentPage = 'news';
                        }, 500);

                    } catch (error) {
                        this.showMessage('Ошибка создания статьи', 'error');
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                },

                // Переключение страниц
                navigateTo(page) {
                    this.currentPage = page;
                    if (page === 'news' || page === 'home') {
                        this.loadArticles();
                    }
                    this.message = null;
                },

                // Форматирование даты
                formatDate(dateString) {
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    return new Date(dateString).toLocaleDateString('ru-RU', options);
                },

                // Форматирование даты и времени для комментариев
                formatDateTime(dateTimeString) {
                    const date = new Date(dateTimeString);
                    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                }
            }
        });
    }
});