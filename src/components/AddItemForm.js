import React, { useState } from 'react';
import axios from 'axios';
import { useItems } from './ItemsContext';

const AddItemForm = () => {
    const [item, setItem] = useState({ name: '', description: '', price: 0, quantity: 1 });
    const [image, setImage] = useState(null);
    const {fetchItems} = useItems();

    const handleCapture = (e) => {
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                //set the captured image to the state
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

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
            console.log(`Adding in progress`);
            const response = await axios.post(
                'http://localhost:3500/item/add', 
                bodyParameters,
                config
            );
            console.log(response);
            if(response.status===201){
                console.log('Item added successfully!');
                fetchItems();
                setItem({ name: '', description: '', price: 0, quantity: 1 }); // Reset form
            }
        } catch (error) {
            console.log(error);
            alert('Failed to add item. Please try again.');
        }
        
    };

    return (
        <section className="add-items">
            <form onSubmit={handleSubmit}>
                {/* <p>Add items</p> */}
                <input type="text" value={item.name} onChange={(e) => setItem({...item, name: e.target.value})} placeholder="Item Name" required />
                {/* Other input fields */}

                {/* Input for capturing the image */}
                <input
                    type="file"
                    accept="image/*"
                    capture="environment" // Use 'user' for front camera on mobile devices
                    onChange={handleCapture}
                    style={{ display: 'none' }} // Hide the default file input
                    id="cameraInput"
                    />
                <label htmlFor="cameraInput">
                    {/* This button will open the camera on click */}
                    <button type="button" onClick={() => document.getElementById('cameraInput').click()}>
                        Take Picture
                    </button>
                </label>

                {/* Display the captured image if available */}
                {image && <p> Image processing on the way!</p>}

                <button type="submit">Add Item</button>
            </form>
        </section>  
    );
};

export default AddItemForm;
