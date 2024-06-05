require('dotenv').config();

  const host=  process.env.DB_HOST
  const user = process.env.DB_USER
  const password = process.env.DB_PASSWORD
 const database = process.env.DB_DATABASE

const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroSequelize = require('@admin-bro/sequelize');
const express = require('express');
const formidableMiddleware = require('express-formidable');

const { Sequelize } = require('sequelize');

// Stel de databaseverbinding in
const sequelize = new Sequelize(`mysql://${user}:${password}@localhost:9001/${database}`, {
    dialect: 'mysql'
});

AdminBro.registerAdapter(AdminBroSequelize);

const adminBro = new AdminBro({
  databases: [sequelize],
  rootPath: '/admin',
});

const app = express();
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    if (email === 'admin@example.com' && password === 'password') {
      return {email: 'admin@example.com'}
    }
    return null;
  },
  cookiePassword: 'nietvantoepassing1887',
});

app.use(formidableMiddleware());
app.use(adminBro.options.rootPath, router);

app.listen(3005, () => console.log('AdminBro running on http://localhost:3005/admin'));
