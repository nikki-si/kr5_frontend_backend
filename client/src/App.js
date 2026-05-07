import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLogin, setIsLogin] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(url, { name, email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      }
      setName(''); setEmail(''); setPassword('');
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.error || err.message));
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', { name, email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName(''); setEmail('');
      fetchUsers();
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.error || err.message));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div style={{ fontSize: 50, marginBottom: 10 }}>🐱🎀</div>
          <div className="auth-header">
            <h1>{isLogin ? 'Вход' : 'Регистрация'}</h1>
            <p>{isLogin ? 'Добро пожаловать обратно!' : 'Создай новый аккаунт'}</p>
          </div>
          <form onSubmit={handleAuth}>
            <div className="form-group">
              <label>💝 Имя</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Твоё имя..." required />
            </div>
            <div className="form-group">
              <label>📧 Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@kitty.com" type="email" required />
            </div>
            <div className="form-group">
              <label>🔒 Пароль</label>
              <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Секретный пароль" type="password" required />
            </div>
            <button type="submit" className="btn-primary">
              {isLogin ? '🐱 Войти' : '🎀 Зарегистрироваться'}
            </button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)} className="btn-link">
            {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <header className="main-header">
        <h1>🐱 Hello Kitty Dashboard 🎀</h1>
        <button onClick={logout} className="btn-logout">Выйти</button>
      </header>

      <div className="card">
        <h2>✨ Создать нового друга ✨</h2>
        <form onSubmit={createUser} className="create-form">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="🌸 Имя" required />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="📧 Email" type="email" required />
          <button type="submit" className="btn-primary">🎀 Создать</button>
        </form>
      </div>

      <div className="card">
        <h2>💖 Мои друзья ({users.length}) 💖</h2>
        {users.length === 0 ? (
          <p className="empty-state">Пока нет друзей... Создай первого! 🐱</p>
        ) : (
          users.map(u => (
            <div key={u.id} className="user-card">
              <div className="user-avatar">{u.name[0].toUpperCase()}</div>
              <div className="user-info">
                <strong>🌸 {u.name}</strong>
                <span>📧 {u.email}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
