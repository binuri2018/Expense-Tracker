import React, { useState } from 'react';
import './ExpenseEditModal.css';

const ExpenseEditModal = ({ expense, onClose, onExpenseUpdated }) => {
  const [formData, setFormData] = useState({
    title: expense.title,
    category: expense.category,
    amount: expense.amount
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
      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: 'PUT',
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
        onExpenseUpdated(data.expense);
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update expense');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      setError(error.message || 'Failed to update expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <h3>Edit Expense</h3>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>
        
        {error && (
          <div className="edit-modal-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="edit-modal-form">
          <div className="form-group">
            <label htmlFor="edit-title" className="form-label">
              Expense Title
            </label>
            <input
              type="text"
              id="edit-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Grocery shopping, Gas, Movie tickets"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-category" className="form-label">
              Category
            </label>
            <select
              id="edit-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-amount" className="form-label">
              Amount ($)
            </label>
            <input
              type="number"
              id="edit-amount"
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
          
          <div className="edit-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseEditModal;
