import { Sequelize } from 'sequelize';
import sequelize from './sequelize.js';
import '../models/associations.js'; // Import associations to set them up

const requiredTables = ['users', 'posts', 'comments', 'categories'];

const dbConnect = async () => {
  const dbPassword = process.env.DB_PASSWORD;
  if (!dbPassword) {
    throw new Error('DB_PASSWORD environment variable is required.');
  }

  try {
    // Authenticate with the existing database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }

  try {
    // Check if all required tables exist
    const queryInterface = sequelize.getQueryInterface();
    const existingTables = await queryInterface.showAllTables();
    const missingTables = requiredTables.filter(
      (table) => !existingTables.includes(table)
    );

    if (missingTables.length > 0) {
      console.log(
        `Missing tables: ${missingTables.join(', ')}. Creating tables...`
      );
      // Sync all models to create missing tables
      await sequelize.sync(); // Creates tables if they don't exist, without altering existing ones
      console.log('All models were synchronized successfully.');
    } else {
      console.log('All required tables are available.');
    }
  } catch (syncError) {
    console.error('Failed to sync tables:', syncError.message);
    throw syncError;
  }
};

export default dbConnect;
