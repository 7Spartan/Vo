import { useNavigate } from "react-router-dom";
import AddItemForm from "./AddItemForm";

const Dashboard = ({setLogInState}) =>{
const navigate = useNavigate();

const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('user');
    setLogInState(false);
    navigate('/signin');
};
return(
    <div className="dashboard">
        <p className='just_text'>Welcome to the Dashboard!</p>
        <AddItemForm/>
        <button onClick={handleLogout}>Logout</button>
    </div>
);
};

export default Dashboard;