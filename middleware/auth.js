const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key_2025';

// Проверка токена
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Требуется авторизация' });

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Токен недействителен или истёк' });
  }
}

// Проверка ролей
function roleMiddleware(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Недостаточно прав. Требуются роли: ' + roles.join(', ') });
    }
    next();
  };
}

module.exports = { authMiddleware, roleMiddleware };
