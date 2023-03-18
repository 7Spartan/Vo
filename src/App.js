import React from 'react'
import "./App.css"
import { useState} from 'react';
import userNameGenerator from 'username-generator';
import axios from 'axios';

function App() {
	const [dynamicclassName, setDynamicclassName] = useState(false);
	const [dynamicUserNamePlaceHolder, setDynamicUserNamePlaceHolder] = useState(userNameGenerator.generateUsername());
	const [userName, setUserName] = useState('');
	const [userPassword, setUserPassword] = useState('');
  	const [logInState, setLogInState] = useState(false);

  const signUpHandleClick = () => {
		setDynamicclassName(true);
		setDynamicUserNamePlaceHolder(userNameGenerator.generateUsername());
	}

	const signInHandleClick = () => {
		setDynamicclassName(false);
		setDynamicUserNamePlaceHolder(userNameGenerator.generateUsername());
	}

	const  validateUser = () => {
		axios.post("http://localhost:3500/auth", {
			user : userName,
			pwd : userPassword,
		}).then((response)=> {
			console.log(response);
      if(response.status === 200 ? setLogInState(true) : setLogInState(false));
		}).catch(error => console.log(error))
	}

	const  registerUser = () => {
		axios.post("http://localhost:3500/register", {
			user : userName,
			pwd : userPassword,
		}).then((response)=> {
			console.log(response);
		}).catch(error => console.log(error))
	}


	return (
	
    <div>
			<div className={dynamicclassName ? "container right-panel-active" : "container"} id="container">
		<div className="form-container sign-up-container">
			<form action="#">
				<h1>Create Account</h1>
				<span>choose a cool name for registration</span>
				<input 
					type="username" 
					placeholder= {`Username: ${dynamicUserNamePlaceHolder}`}
					onChange = {(event) => setUserName(event.target.value)}
				/>
				<input 
					type="password" 
					placeholder="Password" 
					autoComplete='' 
					onChange = {(event) => setUserPassword(event.target.value)}
				/>
				<button
					onClick={() => {registerUser()}}
				>Sign Up</button>
			</form>
		</div>
		<div className="form-container sign-in-container">
			<form id='signIn' action="#">
				<h1>Sign in</h1>
				<span>using your account</span>
				<input 
					type="username" 
					name='uname' 
					placeholder={`Username: ${dynamicUserNamePlaceHolder}`} 
					onChange = {(event) => setUserName(event.target.value)}
				/>
				<input 
					type="password" 
					name='pass' 
					placeholder="Password" 
					autoComplete=''
					onChange = {(event) => setUserPassword(event.target.value)}
				/>

				<a>Forgot your password?</a>
				<button
					onClick={() => {validateUser()}}
				>Sign In</button>
			</form>
		</div>
		<div className="overlay-container">
			<div className="overlay">
				<div className="overlay-panel overlay-left">
					<h1>Welcome Back!</h1>
					<p>Get back to your notes?</p>
					<button 
						className="ghost" 
						id="signIn"
						onClick={() => {signInHandleClick()}}
					>Sign In</button>
				</div>
				<div className="overlay-panel overlay-right">
					<h1>Hello!</h1>
					<p>Visit the great note taking application</p>
					<button 
						className="ghost" 
						id="signUp"
						onClick={() => {signUpHandleClick()}}
					>Sign Up</button>
				</div>
			</div>
		</div>
			</div>
    </div>
  )
}

export default App