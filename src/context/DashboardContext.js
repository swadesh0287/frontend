import React, { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  categories: []
};

// Actions
const ADD_WIDGET = 'ADD_WIDGET';
const REMOVE_WIDGET = 'REMOVE_WIDGET';
const SET_CATEGORIES = 'SET_CATEGORIES';
const ADD_CATEGORY = 'ADD_CATEGORY';

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case ADD_WIDGET:
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === action.payload.categoryId
            ? {
                ...category,
                widgets: [...category.widgets, action.payload.widget]
              }
            : category
        )
      };
    case REMOVE_WIDGET:
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === action.payload.categoryId
            ? {
                ...category,
                widgets: category.widgets.filter(widget => widget.id !== action.payload.widgetId)
              }
            : category
        )
      };
      case ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload] // Add new category to the state
      };
    default:
      return state;
  }
};

// Create Context
const DashboardContext = createContext();

// Provider
export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use context
export const useDashboard = () => useContext(DashboardContext);
