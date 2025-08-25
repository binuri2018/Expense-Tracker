import React, { useState } from 'react';
import './ExpenseForm.css';

const ExpenseForm = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Healthcare',
    'Utilities',
    'Housing',
    'Education',
    'Travel',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Please enter an expense title');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          category: formData.category,
          amount: parseFloat(formData.amount)
        })
      });

      if (response.ok) {
        const data = await response.json();
        onExpenseAdded(data.expense);
        
        // Reset form
        setFormData({
          title: '',
          category: '',
          amount: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      setError(error.message || 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form-container">
      <h2 className="expense-form-title">Add New Expense</h2>
      
      {error && (
        <div className="expense-form-error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Expense Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Grocery shopping, Gas, Movie tickets"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-input"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>
        
        <button
          type="submit"
          className="expense-form-button"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
