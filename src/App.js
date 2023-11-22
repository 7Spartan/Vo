// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import SignIn from './components/SignIn'; // Make sure this import is correct

import "./App.css";

const App = () => {
  	const [logInState, setLogInState] = useState(false);

	useEffect(() => {
		const user = localStorage.getItem('user');
		if (user) {
			setLogInState(true);
		}
	}, []); 

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Navigate to="/signin" />} />
				<Route path="/signin" element={!logInState ? <SignIn setLogInState={setLogInState}/> : <Navigate replace to="/dashboard" />} />
				<Route path="/dashboard" element={logInState ? <Dashboard setLogInState={setLogInState}/> : <Navigate replace to="/signin" />} />
				<Route path="/profile" element={logInState ? <Profile /> : <Navigate replace to="/signin" />} />
				{/* other routes */}
			</Routes>
		</Router>
	);
}

export default App;
