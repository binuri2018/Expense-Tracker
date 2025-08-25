import React from 'react';
import './ExpenseStats.css';

const ExpenseStats = ({ stats }) => {
  if (!stats) {
    return (
      <div className="expense-stats-container">
        <h2 className="expense-stats-title">Expense Summary</h2>
        <div className="expense-stats-loading">
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const { summary, categoryStats, recentExpenses } = stats;

  return (
    <div className="expense-stats-container">
      <h2 className="expense-stats-title">Expense Summary</h2>
      
      {/* Summary Cards */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{summary.totalExpenses}</div>
            <div className="stat-label">Total Expenses</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(summary.totalAmount)}</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(summary.averageAmount)}</div>
            <div className="stat-label">Average per Expense</div>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="stats-section">
        <h3 className="stats-section-title">Top Spending Categories</h3>
        <div className="category-stats">
          {categoryStats.slice(0, 5).map((category, index) => (
            <div key={category.category} className="category-stat-item">
              <div className="category-stat-header">
                <span className="category-name">{category.category}</span>
                <span className="category-amount">{formatCurrency(category.total)}</span>
              </div>
              <div className="category-stat-bar">
                <div 
                  className="category-stat-fill"
                  style={{ 
                    width: `${(category.total / summary.totalAmount) * 100}%`,
                    backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                  }}
                ></div>
              </div>
              <div className="category-stat-count">
                {category.count} expense{category.count !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="stats-section">
        <h3 className="stats-section-title">Recent Expenses (Last 7 Days)</h3>
        <div className="recent-expenses">
          {recentExpenses.length > 0 ? (
            recentExpenses.slice(0, 5).map(expense => (
              <div key={expense.id} className="recent-expense-item">
                <div className="recent-expense-info">
                  <div className="recent-expense-title">{expense.title}</div>
                  <div className="recent-expense-category">{expense.category}</div>
                </div>
                <div className="recent-expense-amount">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            ))
          ) : (
            <p className="no-recent-expenses">No expenses in the last 7 days</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseStats;
