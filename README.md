# Expense Tracker Dashboard

A full-stack web application for tracking personal expenses, featuring user authentication, data visualization, and secure storage using SQLite. Built with React, Node.js, Express, and SQLite.

## Features
- **User Authentication**: Register and login securely with JWT-based authentication.
- **Expense Management**: Add, edit, delete, and view expenses categorized by type.
- **Data Visualization**: Interactive charts and statistics for expense analysis.
- **Responsive Dashboard**: Modern UI built with React.
- **Secure Backend**: Express server with security middleware (Helmet, CORS, rate limiting).
- **SQLite Database**: Persistent storage for users and expenses.

## Technologies Used
- **Frontend**: React, React Router, Axios, Recharts
- **Backend**: Node.js, Express, SQLite, JWT, bcryptjs
- **Security**: Helmet, CORS, express-rate-limit

## Project Structure
```
config.env                # Environment variables
package.json              # Project metadata and scripts
client/                   # React frontend
  src/
    components/           # Reusable UI components
    contexts/             # Auth context
    pages/                # Main pages (Dashboard, Login, Register)
server/                   # Express backend
  index.js                # Server entry point
  database/               # SQLite database and logic
  middleware/             # Auth and security middleware
  routes/                 # API routes (auth, expenses)
```

## Getting Started
### Prerequisites
- Node.js & npm

### Installation
1. **Clone the repository**
   ```
   git clone <repo-url>
   cd expecnce_tracker - Copy
   ```
2. **Install dependencies**
   ```
   npm run install-all
   ```
3. **Configure environment variables**
   - Edit `config.env` for secrets and settings (e.g., JWT secret, PORT).

### Running the App
- **Start the backend**
  ```
  
  npm start
  ```
- **Start the frontend**
  ```
  cd client
  npm start
  ```

### Build for Production
- **Frontend build**
  ```
  cd client
  npm run build
  ```

## API Endpoints
- `/api/auth/register` - Register new user
- `/api/auth/login` - Login user
- `/api/expenses` - CRUD operations for expenses (protected)


