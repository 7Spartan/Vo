import React, { useState } from 'react';
import { useItems } from './ItemsContext';
import axios from 'axios';

const ItemsList = () => {
    const {items, fetchItems} = useItems();
    const [selectedItems, setSelectedItems] = useState(new Set());

    const toggleItemSelection = (itemId) => {
        setSelectedItems((prevSelectedItems) => {
            const newSelection = new Set(prevSelectedItems);
            if(newSelection.has(itemId)){
                newSelection.delete(itemId);
            }else{
                newSelection.add(itemId);
            }
            return newSelection;
        });
    };

    const deleteSelectedItems = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('user_bearer_token');
        const config = {
            headers:{
                Authorization:token,
                'Content-Type' : 'application/json'
            }
        };

        const bodyParameters = JSON.stringify({ itemIds: Array.from(selectedItems) });
        console.log(config);
        try {
            console.log(`Deletion in progress`);
            const response = await axios.post(
                'http://localhost:3500/item/delete', 
                bodyParameters,
                config
            );
            console.log(response);
            if(response.status===200){
                console.log('Item removed!');
                fetchItems(); // Fetch the updated items list
                setSelectedItems(new Set());
            }
        } catch (error) {
            console.log(error);
            alert('Failed to add item. Please try again.');
        }

    };

    return (
        <section className="item-list">
            <div>
                <button onClick={deleteSelectedItems}>Delete</button>
                {/* <h2>Your Items</h2> */}
                <table>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id}>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked = {selectedItems.has(item._id)}
                                        onChange={()=> toggleItemSelection(item._id)}
                                    />
                                </td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.description}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                {/* Render more item details if needed */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ItemsList;
