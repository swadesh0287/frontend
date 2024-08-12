import './Dashboard.css'; 

import React, { useEffect, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
    const { state, dispatch } = useDashboard();
    const [newWidgetName, setNewWidgetName] = useState('');
    const [newWidgetText, setNewWidgetText] = useState('');
    const [newWidgetImage, setNewWidgetImage] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarVisible, setSidebarVisible] = useState(false);

    useEffect(() => {
      fetch('http://localhost:5000/api/categories')
        .then(response => response.json())
        .then(data => dispatch({ type: 'SET_CATEGORIES', payload: data }));
    }, [dispatch]);

    const handleAddWidget = () => {
      if (newWidgetName && newWidgetText && selectedCategoryId) {
        const newWidget = {
          id: uuidv4(),
          name: newWidgetName,
          text: newWidgetText,
          image: newWidgetImage
        };
        fetch('http://localhost:5000/api/add-widget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId: selectedCategoryId, widget: newWidget })
        })
          .then(response => response.json())
          .then(() => {
            dispatch({
              type: 'ADD_WIDGET',
              payload: { categoryId: selectedCategoryId, widget: newWidget }
            });
            setNewWidgetName('');
            setNewWidgetText('');
            setNewWidgetImage('');
            setSidebarVisible(false);
          });
      }
    };

    const handleAddCategory = () => {
      if (newCategoryName) {
        const newCategory = {
          id: uuidv4(),
          name: newCategoryName,
        };
        fetch('http://localhost:5000/api/add-category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCategory)
        })
          .then(response => response.json())
          .then(() => {
            dispatch({
              type: 'ADD_CATEGORY',
              payload: newCategory
            });
            setNewCategoryName('');
          });
      }
    };

    const handleRemoveWidget = (categoryId, widgetId) => {
      fetch('http://localhost:5000/api/remove-widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, widgetId })
      })
        .then(response => response.json())
        .then(() => {
          dispatch({
            type: 'REMOVE_WIDGET',
            payload: { categoryId, widgetId }
          });
        });
    };

    

    const handleSidebarOpen = (categoryId) => {
      setSelectedCategoryId(categoryId);
      setSidebarVisible(true);
    };

    const handleSidebarClose = () => {
      setSelectedCategoryId('');
      setSidebarVisible(false);
    };

    const filteredCategories = state.categories.map(category => ({
        ...category,
        widgets: category.widgets ? category.widgets.filter(widget =>
          widget.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) : []  // Default to an empty array if widgets is undefined
      }));
      

    return (
      <div className="page-container">
        <div className="header-container">
          <h1>Dashboard</h1>
          <div className="search-input-container">
            <input
              className="search-input"
              type="text"
              placeholder="Search Widgets"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-input-icon">🔍</span>
          </div>
        </div>
        <div className="add-widget-container">
          <h2>CNAPP Dashboard</h2>
          <button className="add-widget-button" onClick={() => handleSidebarOpen('')}>+ Add Widget</button>
        </div>
        {filteredCategories.map(category => (
          <div key={category.id} className="category-section">
            <h2 className="category-heading">{category.name}</h2>
            <div className="widget-container">
              {category.widgets.map(widget => (
                <div key={widget.id} className="widget-card">
                  <div className="widget-header">
                    <h3 className="widget-heading">{widget.name}</h3>
                    <button className="remove-widget-button" onClick={() => handleRemoveWidget(category.id, widget.id)}>❌</button>
                  </div>
                  <div className="widget-content">
                    <img src={widget.image || 'https://via.placeholder.com/100'} alt={widget.name} className="widget-image" />
                    <p className="widget-text">{widget.text}</p>
                  </div>
                </div>
              ))}
              <div className="widget-card add-widget-card" onClick={() => handleSidebarOpen(category.id)}>
                <h3 className="widget-heading">+ Add Widget</h3>
              </div>
            </div>
          </div>
        ))}
        {sidebarVisible && (
          <div className="sidebar">
            <div className="sidebar-content">
            <div className="add-category-container">
                <h2>Add New Category</h2>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <div className="sidebar-buttons">
                  <button onClick={handleAddCategory}>Add Category</button>
                  <button className="cancel" onClick={handleSidebarClose}>Cancel</button>
                </div>
              </div>
              <h2>Add New Widget</h2>
              <div className="form-group">
              <select
             id="existing-category"
             value={selectedCategoryId}
             onChange={(e) => setSelectedCategoryId(e.target.value)}
             >
             <option value="">Select a Category</option>
               {state.categories.map(category => (
             <option key={category.id} value={category.id}>
               {category.name}
             </option>
            ))}
            </select>
        </div>
    
              <input
                type="text"
                placeholder="Widget Heading"
                value={newWidgetName}
                onChange={(e) => setNewWidgetName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Widget Text"
                value={newWidgetText}
                onChange={(e) => setNewWidgetText(e.target.value)}
              />
              <input
                type="text"
                placeholder="Widget Image URL"
                value={newWidgetImage}
                onChange={(e) => setNewWidgetImage(e.target.value)}
              />
              <div className="sidebar-buttons">
                <button onClick={handleAddWidget}>Add Widget</button>
                <button className="cancel" onClick={handleSidebarClose}>Cancel</button>
              </div>
             
            </div>
          </div>
        )}
      </div>
    );
};

export default Dashboard;
