import React from 'react';
import { useItems } from './ItemsContext';

const ItemsList = () => {


    const {items} = useItems();

    return (
        <section className="item-list">
            <div>
                <h2>Your Items</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            {/* Add more headers if needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id}>
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
