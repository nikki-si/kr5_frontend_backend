import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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
      console.error('Ошибка загрузки пользователей:', err);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  const handleAuth = async (e) => {
    e.preventDefault();
    
    const data = { name, email, password };
    console.log('Отправляю:', data);  // для отладки
    
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(url, data);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      }
      
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('Ошибка:', errorMsg);
      alert('Ошибка: ' + errorMsg);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    
    const data = { name, email };
    console.log('Создаю пользователя:', data);
    
    try {
      await axios.post('/api/users', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName('');
      setEmail('');
      fetchUsers();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      alert('Ошибка создания пользователя: ' + errorMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: '50px auto', padding: 20 }}>
        <h1>{isLogin ? 'Вход' : 'Регистрация'}</h1>
        <form onSubmit={handleAuth}>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Имя" 
            required 
            style={{ display: 'block', width: '100%', margin: '10px 0', padding: 10 }} 
          />
          <input 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Email" 
            type="email" 
            required 
            style={{ display: 'block', width: '100%', margin: '10px 0', padding: 10 }} 
          />
          <input 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Пароль" 
            type="password" 
            required 
            style={{ display: 'block', width: '100%', margin: '10px 0', padding: 10 }} 
          />
          <button type="submit" style={{ width: '100%', padding: 10 }}>
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ marginTop: 10, width: '100%', padding: 10 }}
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Добро пожаловать!</h1>
        <button onClick={logout}>Выйти</button>
      </div>

      <form onSubmit={createUser} style={{ marginBottom: 20 }}>
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Имя" 
          required 
          style={{ marginRight: 10, padding: 5 }} 
        />
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
          type="email" 
          required 
          style={{ marginRight: 10, padding: 5 }} 
        />
        <button type="submit">Создать пользователя</button>
      </form>

      <h2>Список пользователей:</h2>
      {users.length === 0 ? (
        <p>Пока нет пользователей</p>
      ) : (
        <ul>
          {users.map(u => (
            <li key={u.id}>{u.name} ({u.email})</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
