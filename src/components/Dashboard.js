import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import AddItemForm from "./AddItemForm";
import ItemsList from "./itemsList";
import EventList from './EventList';
import {ItemsProvider} from './ItemsContext';
import axios from 'axios';

const Dashboard = ({setLogInState}) =>{
    const navigate = useNavigate();

    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('user');
        setLogInState(false);
        navigate('/signin');
    };

    // Dummy data for events
    const [events, setEvents] = useState([
        { name: "Snowboarding Championship", date: "2023-12-10" },
        // Add more dummy events here
    ]);

    const [itemslist, setItemslist] = useState([]);


    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('user_bearer_token');
                const response = await axios.get('https://192.168.1.73:3500/item/list', {
                    headers: {
                        Authorization: token
                    }
                });

                if (response.status === 200) {
                    setItemslist(response.data);
                }
            } catch (error) {
                console.error('Error fetching items:', error);
                // Optionally handle errors, like setting an error state
            }
        };

        fetchItems();
    }, []);

    return(
        <ItemsProvider>
            <div className="dashboard">
                {/* <p className='just_text'>Welcome to the Dashboard!</p> */}
                <AddItemForm/>
                <ItemsList itemslist={itemslist}/>
                <EventList events={events}/>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </ItemsProvider>
    );
};

export default Dashboard;