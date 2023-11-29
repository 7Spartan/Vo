import React, { useState } from 'react';
import axios from 'axios';

const AddItemForm = () => {
    const [item, setItem] = useState({ name: '', description: '', price: 0, quantity: 0 });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('user_bearer_token');
        const config = {
            headers:{
                Authorization:token,
                'Content-Type' : 'application/json'
            }
        };

        const bodyParameters = JSON.stringify({"item":{
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "quantity": item.quantity
        }});

        try {
            console.log(token);
            const response = await axios.post(
                'http://localhost:3500/item/add', 
                bodyParameters,
                config
            );
            if(response===201){
                alert('Item added successfully!');
                setItem({ name: '', description: '', price: 0, quantity: 0 }); // Reset form
            }
        } catch (error) {
            console.log(error);
            alert('Failed to add item. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={item.name} onChange={(e) => setItem({...item, name: e.target.value})} placeholder="Item Name" required />
            {/* Other input fields */}
            <button type="submit">Add Item</button>
        </form>
    );
};

export default AddItemForm;
