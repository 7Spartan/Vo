import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useItems } from './ItemsContext';
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const cocoSsd = require('@tensorflow-models/coco-ssd');

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
        cocoSsd.load().then(setModel);
    }, []);
    
    
    
    const startCamera = async(facingMode = 'environment') => {
        if (stream) {
            // Stop all tracks on the existing stream before switching
            stream.getTracks().forEach(track => track.stop());
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('Browser does not support getUserMedia');
            return;
        }
        
        try{
            const stream = await navigator.mediaDevices.getUserMedia({video:{aspectRatio:1, facingMode}});
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

    const drawBoundingBoxes = (predictions) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        const xScale =  videoWidth / canvasRef.current.width;
        const yScale = videoHeight / canvasRef.current.height;

        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox.map((val,idx) => {
                return idx % 2 === 0 ? val * xScale : val * yScale;
            });

            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = '#00FF00';
            ctx.fillText(
                `${prediction.class}: ${Math.round(prediction.score * 100)}%`,
                x,
                y
            );
        });
    };
    
    
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
                            const newPredictions = await model.detect(imgElement);
                            setPredictions(newPredictions);
                            drawBoundingBoxes(newPredictions);                            
                            if (newPredictions.length > 0) {
                                const highestProbability = newPredictions[0];
                                setItem(prevItem => ({
                                    ...prevItem,
                                    name: highestProbability.class // Sets the item name to the most probable class
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


    useEffect(()=>{
        const adjustCanvasToVideo  = () => {
            if(canvasRef.current && videoRef.current){
                const video = videoRef.current;
                const videoWidth = video.videoWidth;
                const videoHeight  = video.videoHeight;

                // console.log(videoHeight);
                // console.log(videoWidth);

                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;

                canvasRef.current.style.width = `${videoWidth}px`;
                canvasRef.current.style.height = `${videoHeight}px`;
            }
        };

        
        // Adjust canvas size whenever the window resizes
        window.addEventListener('resize', adjustCanvasToVideo);
        
        // Set the initial canvas size to match the video
        if (videoRef.current) {
            videoRef.current.addEventListener('loadedmetadata', adjustCanvasToVideo);
        }
        
        // Cleanup function to remove event listeners
        return () => {
            window.removeEventListener('resize', adjustCanvasToVideo);
            if (videoRef.current) {
            videoRef.current.removeEventListener('loadedmetadata', adjustCanvasToVideo);
            }
        };
    },[videoRef, canvasRef]);


    useEffect(()=>{
        //This function runs when the component unmounts
        return () => {
            if(stream){
                stream.getTracks().forEach(track => track.stop());
            }
        };
    },[stream]);

    // Stop the camera stream when the component unmounts
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
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
                'https://192.168.1.73:3500/item/add', 
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
                        <>
                            <button onClick={() => startCamera('user')}>Front Camera</button>
                            <button onClick={() => startCamera('environment')}>Rear Camera</button>
                        </>
                    )}
    
                    {stream && (
                        <>
                            <div style={{ position: 'relative' }}>
                                <video ref={videoRef} autoPlay style={{width: '100%',height: 'auto' }}></video>
                                <canvas ref={canvasRef} style={{position: 'absolute',top: 0,left: 0}}></canvas>
                            </div>
                            <button type="button" onClick={captureImage}>Take Picture</button>
                            <button type='button' onClick={stopCamera}>Stop Camera</button>
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
