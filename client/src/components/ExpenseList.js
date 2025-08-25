import React, { useState } from 'react';
import ExpenseEditModal from './ExpenseEditModal';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onExpenseUpdated, onExpenseDeleted }) => {
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = (expense) => {
    setDeletingExpense(expense);
  };

  const confirmDelete = async () => {
    if (!deletingExpense) return;

    try {
      const response = await fetch(`/api/expenses/${deletingExpense.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        onExpenseDeleted(deletingExpense.id);
        setDeletingExpense(null);
      } else {
        throw new Error('Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (expenses.length === 0) {
    return (
      <div className="expense-list-container">
        <h2 className="expense-list-title">Your Expenses</h2>
        <div className="expense-list-empty">
          <p>No expenses yet. Add your first expense above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list-container">
      <h2 className="expense-list-title">Your Expenses</h2>
      
      <div className="expense-list-table-container">
        <table className="expense-list-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id} className="expense-row">
                <td className="expense-title">{expense.title}</td>
                <td className="expense-category">
                  <span className={`category-badge category-${expense.category.toLowerCase().replace(/\s+/g, '-')}`}>
                    {expense.category}
                  </span>
                </td>
                <td className="expense-amount">{formatAmount(expense.amount)}</td>
                <td className="expense-date">{formatDate(expense.createdAt)}</td>
                <td className="expense-actions">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="action-button edit-button"
                    title="Edit expense"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(expense)}
                    className="action-button delete-button"
                    title="Delete expense"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingExpense && (
        <ExpenseEditModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onExpenseUpdated={onExpenseUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingExpense && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete "{deletingExpense.title}"? 
              This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button
                onClick={() => setDeletingExpense(null)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="delete-confirm-button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
