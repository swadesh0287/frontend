// server/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data.json');

// Read data from JSON file
const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Write data to JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Get categories
app.get('/api/categories', (req, res) => {
  const data = readData();
  res.json(data.categories);
});

// Add widget
app.post('/api/add-widget', (req, res) => {
  const { categoryId, widget } = req.body;
  const data = readData();
  const category = data.categories.find(c => c.id === categoryId);
  if (category) {
    category.widgets.push(widget);
    writeData(data);
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

// Remove widget
app.post('/api/remove-widget', (req, res) => {
  const { categoryId, widgetId } = req.body;
  const data = readData();
  const category = data.categories.find(c => c.id === categoryId);
  if (category) {
    category.widgets = category.widgets.filter(w => w.id !== widgetId);
    writeData(data);
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

// Add category
app.post('/api/add-category', (req, res) => {
    const { name } = req.body;
    const data = readData();
    
    // Create a new category
    const newCategory = {
      id: (data.categories.length + 1).toString(), // Simple ID generation
      name: name,
      widgets: []
    };
  
    // Add the new category to the list
    data.categories.push(newCategory);
    writeData(data);
    
    res.status(201).json(newCategory);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
