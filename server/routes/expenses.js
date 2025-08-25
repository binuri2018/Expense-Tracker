const express = require('express');
const { getQuery, runQuery, allQuery } = require('../database/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all expense routes
router.use(authenticateToken);

// Get all expenses for the authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const expenses = await allQuery(
      'SELECT id, title, category, amount, createdAt FROM expenses WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );

    res.json({
      expenses,
      count: expenses.length
    });

  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      error: 'Internal server error while fetching expenses'
    });
  }
});

// Get expense by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const expense = await getQuery(
      'SELECT id, title, category, amount, createdAt FROM expenses WHERE id = ? AND userId = ?',
      [id, userId]
    );

    if (!expense) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    res.json({ expense });

  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({
      error: 'Internal server error while fetching expense'
    });
  }
});

// Create new expense
router.post('/', async (req, res) => {
  try {
    const { title, category, amount } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!title || !category || !amount) {
      return res.status(400).json({
        error: 'Title, category, and amount are required'
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be a positive number'
      });
    }

    if (title.trim().length === 0) {
      return res.status(400).json({
        error: 'Title cannot be empty'
      });
    }

    if (category.trim().length === 0) {
      return res.status(400).json({
        error: 'Category cannot be empty'
      });
    }

    // Create expense
    const result = await runQuery(
      'INSERT INTO expenses (userId, title, category, amount) VALUES (?, ?, ?, ?)',
      [userId, title.trim(), category.trim(), amount]
    );

    // Fetch the created expense
    const newExpense = await getQuery(
      'SELECT id, title, category, amount, createdAt FROM expenses WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      message: 'Expense created successfully',
      expense: newExpense
    });

  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({
      error: 'Internal server error while creating expense'
    });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, amount } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!title || !category || !amount) {
      return res.status(400).json({
        error: 'Title, category, and amount are required'
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be a positive number'
      });
    }

    // Check if expense exists and belongs to user
    const existingExpense = await getQuery(
      'SELECT id FROM expenses WHERE id = ? AND userId = ?',
      [id, userId]
    );

    if (!existingExpense) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    // Update expense
    await runQuery(
      'UPDATE expenses SET title = ?, category = ?, amount = ? WHERE id = ? AND userId = ?',
      [title.trim(), category.trim(), amount, id, userId]
    );

    // Fetch the updated expense
    const updatedExpense = await getQuery(
      'SELECT id, title, category, amount, createdAt FROM expenses WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Expense updated successfully',
      expense: updatedExpense
    });

  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({
      error: 'Internal server error while updating expense'
    });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if expense exists and belongs to user
    const existingExpense = await getQuery(
      'SELECT id FROM expenses WHERE id = ? AND userId = ?',
      [id, userId]
    );

    if (!existingExpense) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    // Delete expense
    await runQuery(
      'DELETE FROM expenses WHERE id = ? AND userId = ?',
      [id, userId]
    );

    res.json({
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      error: 'Internal server error while deleting expense'
    });
  }
});

// Get expense statistics for the authenticated user
router.get('/stats/summary', async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get total expenses
    const totalResult = await getQuery(
      'SELECT COUNT(*) as count, SUM(amount) as total FROM expenses WHERE userId = ?',
      [userId]
    );

    // Get expenses by category
    const categoryStats = await allQuery(
      'SELECT category, COUNT(*) as count, SUM(amount) as total FROM expenses WHERE userId = ? GROUP BY category ORDER BY total DESC',
      [userId]
    );

    // Get recent expenses (last 7 days)
    const recentExpenses = await allQuery(
      'SELECT id, title, category, amount, createdAt FROM expenses WHERE userId = ? AND createdAt >= datetime("now", "-7 days") ORDER BY createdAt DESC',
      [userId]
    );

    res.json({
      summary: {
        totalExpenses: totalResult.count || 0,
        totalAmount: totalResult.total || 0,
        averageAmount: totalResult.count > 0 ? (totalResult.total / totalResult.count).toFixed(2) : 0
      },
      categoryStats,
      recentExpenses
    });

  } catch (error) {
    console.error('Error fetching expense statistics:', error);
    res.status(500).json({
      error: 'Internal server error while fetching statistics'
    });
  }
});

module.exports = router;
