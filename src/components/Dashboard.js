import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

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
        <Sidebar/>
        <p>Welcome to Dashboard!</p>
        <button onClick={handleLogout}>Logout</button>
    </div>
);
};

export default Dashboard;