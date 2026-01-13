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
    console.error('Database connection failed :', error.message);
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
        `Missing tables: ${missingTables.join(
          ', '
        )}. Dropping and recreating all required tables...`
      );
      // Drop all required tables to ensure clean recreation
      for (const table of requiredTables) {
        try {
          await queryInterface.dropTable(table, { force: true });
          console.log(`Dropped table: ${table}`);
        } catch (dropError) {
          console.log(`Table ${table} does not exist or already dropped.`);
        }
      }
      // Sync all models to create tables
      await sequelize.sync(); // Creates tables if they don't exist
      console.log('All models were synchronized successfully.');
    } else {
      console.log('All required tables are available.');
      // Note: Removed force recreate of comments table to prevent data loss on restarts
      // If schema issues persist, uncomment and modify the block below
      /*
      // Force recreate comments table if it exists but has issues
      const queryInterface = sequelize.getQueryInterface();
      const existingTables = await queryInterface.showAllTables();
      if (existingTables.includes('comments')) {
        console.log(
          'Dropping and recreating comments table to fix schema issues...'
        );
        // Drop dependent tables first to avoid foreign key constraints
        if (existingTables.includes('likes')) {
          await queryInterface.dropTable('likes', { force: true });
          console.log('Dropped table: likes');
        }
        if (existingTables.includes('ratings')) {
          await queryInterface.dropTable('ratings', { force: true });
          console.log('Dropped table: ratings');
        }
        await queryInterface.dropTable('comments');
        await sequelize.sync(); // Recreate the table
        console.log('Comments table recreated successfully.');
      }
      */
    }
  } catch (syncError) {
    console.error('Failed to sync tables:', syncError.message);
    throw syncError;
  }
};

export default dbConnect;
