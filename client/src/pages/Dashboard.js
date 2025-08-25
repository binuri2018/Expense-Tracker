import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseStats from '../components/ExpenseStats';
import ExpenseCharts from '../components/ExpenseCharts';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch expenses and stats on component mount
  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses);
      } else {
        throw new Error('Failed to fetch expenses');
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/expenses/stats/summary', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    fetchStats(); // Refresh stats
  };

  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    fetchStats(); // Refresh stats
  };

  const handleExpenseDeleted = (expenseId) => {
    setExpenses(prevExpenses => 
      prevExpenses.filter(expense => expense.id !== expenseId)
    );
    fetchStats(); // Refresh stats
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}! 👋</h1>
        <p>Track and manage your expenses with ease</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="dashboard-grid">
        {/* Left Column - Expense Form and List */}
        <div className="dashboard-left">
          <ExpenseForm onExpenseAdded={handleExpenseAdded} />
          <ExpenseList 
            expenses={expenses}
            onExpenseUpdated={handleExpenseUpdated}
            onExpenseDeleted={handleExpenseDeleted}
          />
        </div>

        {/* Right Column - Stats and Charts */}
        <div className="dashboard-right">
          <ExpenseStats stats={stats} />
          <ExpenseCharts stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
