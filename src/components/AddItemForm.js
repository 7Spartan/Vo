import React, { useState } from 'react';
import axios from 'axios';

const AddItemForm = () => {
    const [item, setItem] = useState({ name: '', description: '', price: 0, quantity: 0 });
    const [image, setImage] = useState(null);

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
            console.log(token);
            const response = await axios.post(
                'http://ec2-3-144-160-121.us-east-2.compute.amazonaws.com:3500/item/add', 
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
            <p>Add items</p>
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
    );
};

export default AddItemForm;
