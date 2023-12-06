import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemsList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                // Replace with your actual token retrieval method
                const token = localStorage.getItem('user_bearer_token');
                const response = await axios.get('http://ec2-3-144-160-121.us-east-2.compute.amazonaws.com:3500/item/list', {
                    headers: {
                        Authorization: token
                    }
                });

                if (response.status === 200) {
                    setItems(response.data);
                }
            } catch (error) {
                console.error('Error fetching items:', error);
                // Handle errors, maybe set an error state and show it in UI
            }
        };

        fetchItems();
    }, []);

    return (
        <div>
            <h2>Your Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        {/* Add more headers if needed */}
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.price}</td>
                            <td>{item.category}</td>
                            {/* Render more item details if needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemsList;
