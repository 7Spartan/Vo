import React from 'react';
import { useNavigate } from "react-router-dom";
import AddItemForm from "./AddItemForm";
import ItemsList from "./itemsList";
import {ItemsProvider} from './ItemsContext';

const Dashboard = ({setLogInState}) =>{
    const navigate = useNavigate();

    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('user');
        setLogInState(false);
        navigate('/signin');
    };
    return(
        <ItemsProvider>
            <div className="dashboard">
                <p className='just_text'>Welcome to the Dashboard!</p>
                <AddItemForm/>
                <ItemsList/>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </ItemsProvider>
    );
};

export default Dashboard;