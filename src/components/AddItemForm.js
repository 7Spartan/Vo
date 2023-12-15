import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useItems } from './ItemsContext';
import '@tensorflow/tfjs'
const mobilenet = require('@tensorflow-models/mobilenet');

const AddItemForm = () => {
    const [item, setItem] = useState({ name: '', description: '', price: 0, quantity: 1 });
    const [image, setImage] = useState(null);
    const [model, setModel] = useState(null);
    const {fetchItems} = useItems();
    const [predictions, setPredictions] = useState([]);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Load the model once when the component mounts
    useEffect(() => {
        mobilenet.load().then(setModel);
    }, []);
    
    
    
    const startCamera = async() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('Browser does not support getUserMedia');
            return;
        }
        
        try{
            const stream = await navigator.mediaDevices.getUserMedia({video:{aspectRatio:1}});
            setStream(stream);
        }catch(error){
            console.error('Error accessing camera:',error);
        }
    };
    
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    
    const captureImage = () => {
        if(videoRef.current && canvasRef.current){
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current,0,0,canvasRef.current.width,canvasRef.current.height);
            canvasRef.current.toBlob(async blob=>{
                const imgFile = new File([blob],'captured-image.jpg',{type:"image/jpeg"});
                setImage(URL.createObjectURL(imgFile));

                const imgElement = new Image();
                imgElement.src = URL.createObjectURL(blob);
                imgElement.onload = async() => {
                    if(model){
                        try{
                            const newPredictions = await model.classify(imgElement);
                            setPredictions(newPredictions);
                            console.log(newPredictions);
                            
                            if (newPredictions.length > 0) {
                                const highestProbability = newPredictions[0];
                                setItem(prevItem => ({
                                    ...prevItem,
                                    name: highestProbability.className // Sets the item name to the most probable class
                                }));
                            }
                        } catch (error){
                            console.error("error classifying image:",error);
                        }
                    };
                }
            });
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
                'https://192.168.1.71:3500/item/add', 
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
                {/* <input
                    type="file"
                    accept="image/*"
                    capture="environment" // Use 'user' for front camera on mobile devices
                    onChange={captureImage}
                    style={{ display: 'none' }} // Hide the default file input
                    id="cameraInput"
                /> */}

           
                {/* Display the captured image if available */}
                {/* {image && <p> Image processing on the way!</p>} */}
                <div>
                    {!stream && (
                        <button type="button" onClick={startCamera}>Start Camera</button>
                    )} 
    
                    {stream && (
                        <>
                            <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }}></video>
                            <canvas ref={canvasRef} style={{ display: 'none' ,width: '100%', height: 'auto' }} ></canvas>
                            <button type="button" onClick={captureImage}>Take Picture</button>
                        </>
                    )}
                </div>

                <button type="submit">Add Item</button>
            </form>
            {/* <div>
                {predictions.map(prediction => (
                    <div key={prediction.className}>
                        <p>Object: {prediction.className}</p>
                        <p>Probability: {(prediction.probability * 100).toFixed(2)}%</p>
                    </div>
                ))}
            </div> */}
        </section>  
    );
};

export default AddItemForm;
