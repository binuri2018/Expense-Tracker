const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'expense_tracker.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) {
        console.error('Error enabling foreign keys:', err.message);
        reject(err);
        return;
      }
    });

    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
        reject(err);
        return;
      }
      console.log('Users table created or already exists');
    });

    // Create expenses table
    const createExpensesTable = `
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      )
    `;

    db.run(createExpensesTable, (err) => {
      if (err) {
        console.error('Error creating expenses table:', err.message);
        reject(err);
        return;
      }
      console.log('Expenses table created or already exists');
      
      // Create indexes for better performance
      db.run('CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(userId)', (err) => {
        if (err) console.error('Error creating user_id index:', err.message);
      });
      
      db.run('CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category)', (err) => {
        if (err) console.error('Error creating category index:', err.message);
      });
      
      db.run('CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(createdAt)', (err) => {
        if (err) console.error('Error creating created_at index:', err.message);
      });
      
      resolve();
    });
  });
}

// Helper function to run queries with promises
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Helper function to get single row
function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to get multiple rows
function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  db,
  initializeDatabase,
  runQuery,
  getQuery,
  allQuery
};
