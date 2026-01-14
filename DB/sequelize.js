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
    host: process.env.DB_HOST, // ✅ FORCE TCP
    port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT, 10) : 3306,
    dialect: process.env.DB_DIALECT,
    logging: false,
    dialectOptions: {
      connectTimeout: 10000,
    },
  }
);

export default sequelize;
