import React, { createContext, useState, useContext } from 'react';

// Create the context
const ItemsContext = createContext();

// Provider component
export const ItemsProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    const addItem = item => {
        setItems(prevItems => [...prevItems, item]);
    };

    return (
        <ItemsContext.Provider value={{ items, addItem }}>
            {children}
        </ItemsContext.Provider>
    );
};

// Custom hook
export const useItems = () => useContext(ItemsContext);