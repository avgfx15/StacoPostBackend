import { Sequelize } from 'sequelize';

process.env.DOTENV_CONFIG_QUIET = 'true';

import dotenv from 'dotenv';

dotenv.config({ override: true });

const dbPassword = process.env.DB_PASSWORD;
if (!dbPassword) {
  throw new Error('DB_PASSWORD environment variable is required.');
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: '127.0.0.1', // ✅ FORCE TCP
    port: 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 10000,
    },
  }
);

export default sequelize;
