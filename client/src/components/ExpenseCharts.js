import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ExpenseCharts.css';

const ExpenseCharts = ({ stats }) => {
  if (!stats || !stats.categoryStats || stats.categoryStats.length === 0) {
    return (
      <div className="expense-charts-container">
        <h2 className="expense-charts-title">Expense Charts</h2>
        <div className="expense-charts-empty">
          <p>Add some expenses to see charts and visualizations!</p>
        </div>
      </div>
    );
  }

  const { categoryStats } = stats; // Removed summary

  // Prepare data for pie chart
  const pieChartData = categoryStats.map((category, index) => ({
    name: category.category,
    value: category.total,
    color: `hsl(${index * 60}, 70%, 60%)`
  }));

  // Prepare data for bar chart
  const barChartData = categoryStats.map((category, index) => ({
    name: category.category,
    amount: category.total,
    count: category.count,
    color: `hsl(${index * 60}, 70%, 60%)`
  }));

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            Amount: {formatCurrency(payload[0].value)}
          </p>
          {payload[0].payload.count && (
            <p className="tooltip-count">
              Count: {payload[0].payload.count}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="expense-charts-container">
      <h2 className="expense-charts-title">Expense Charts</h2>
      
      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-section-title">Spending by Category</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={null} // Optional: remove labels from pie chart
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-section-title">Category Comparison</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              >
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="chart-legend">
        <h4>Category Colors</h4>
        <div className="legend-items">
          {categoryStats.map((category, index) => (
            <div key={category.category} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
              ></div>
              <span className="legend-label">{category.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;
