const bcrypt = require('bcrypt');
const User = require('../models/User');
const sequelize = require('../config/database');

async function createAdmin() {
  await sequelize.sync();
  const existing = await User.findOne({ where: { email: 'admin@admin.com' } });
  if (existing) {
    console.log('Админ уже существует:', existing.email);
    process.exit(0);
  }
  const password = await bcrypt.hash('admin123', 10);
  const admin = await User.create({
    name: 'Администратор',
    email: 'admin@admin.com',
    password: password,
    role: 'admin'
  });
  console.log('Админ создан:', admin.email, '/ пароль: admin123');
  process.exit(0);
}

createAdmin();
