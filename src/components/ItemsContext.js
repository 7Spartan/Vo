import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';


// Create the context
const ItemsContext = createContext();

// Provider component
export const ItemsProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    
    const addItem = item => {
        setItems(prevItems => [...prevItems, item]);
    };
    
    const fetchItems = async () => {
        try {
            console.log(`fetch in progress`);
            const token = localStorage.getItem('user_bearer_token');
            const response = await axios.get('http://ec2-3-144-160-121.us-east-2.compute.amazonaws.com:3500/item/list', {
                headers: {
                    Authorization: token
                }
            });

            if (response.status === 200) {
                setItems(response.data);
                console.log(`items updated`);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            // Optionally handle errors, like setting an error state
        }
    };

    useEffect(()=>{
        fetchItems();
    },[]);


    return (
        <ItemsContext.Provider value={{ items, fetchItems }}>
            {children}
        </ItemsContext.Provider>
    );
};

// Custom hook
export const useItems = () => {
    
    const context = useContext(ItemsContext);
    if(context === undefined){
        throw new Error('useItems must be used within an ItemsProvider');
    }

    return context;
};