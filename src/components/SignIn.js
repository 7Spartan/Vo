// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import userNameGenerator from 'username-generator';
import { useNavigate } from 'react-router-dom';

const SignIn = ({setLogInState}) => {
  const [dynamicclassName, setDynamicclassName] = useState(false);
  const [dynamicUserNamePlaceHolder, setDynamicUserNamePlaceHolder] = useState(userNameGenerator.generateUsername());
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const navigate = useNavigate();

  // Rest of your login and registration functions here...
  const signUpHandleClick = () => {
    setDynamicclassName(true);
    setDynamicUserNamePlaceHolder(userNameGenerator.generateUsername());
}

const signInHandleClick = () => {
    setDynamicclassName(false);
    setDynamicUserNamePlaceHolder(userNameGenerator.generateUsername());
}

const  validateUser = (event) => {
    event.preventDefault();
    axios.post("http://localhost:3500/auth/login", {
        email : userName,
        password : userPassword,
    }).then((response)=> {
        // console.log(response);
  if(response.status === 200){
	const token = response.headers['authorization'];
	localStorage.setItem('user_bearer_token',token);
	setLogInState(true);
	navigate('/dashboard'); // Navigate to dashboard after login
	//redirect to the dashboard
  }
}).catch(error =>{
    if (axios.isCancel(error)) {
    console.log('Request canceled', error.message);
    } else if (error.code === 'ECONNABORTED') {
    console.log('Timeout error: ', error.message);
    } else {
    alert("Login Failed:" + error.message);	
    console.log('Login error: ', error);
    }
});
};

const  registerUser = (event) => {
    event.preventDefault();
    axios.post("http://localhost:3500/auth/register", {
        email : userName,
        password : userPassword,
    }).then((response)=> {
        console.log(response);
		if(response.status === 201){
			setDynamicclassName(false);
			alert("Registration successful! Please log in.");
		}else if(response.status === 500){
			alert("Error registering this user");
		}
    }).catch(error => {
        console.log(error);
        alert("Registration Failed:" + error.message);	
    });
};
  // The JSX for your login and registration forms here...
  return(
  <div>
        <div className={dynamicclassName ? "container right-panel-active" : "container"} id="container">
			<div className="form-container sign-up-container">
				<form id ='register' onSubmit={registerUser}>
					<h1>Create Account</h1>
					<span>choose a cool name for registration</span>
					<input 
						type="username" 
						id='username1'
						name='username'
						placeholder= {`Username: ${dynamicUserNamePlaceHolder}`}
						onChange = {(event) => setUserName(event.target.value)}
					/>
					<input 
						type="password" 
						id='password1'
						name='password'
						placeholder="Password" 
						onChange = {(event) => setUserPassword(event.target.value)}
					/>
					<button type='submit'>Sign Up</button>
				</form>
			</div>
			<div className="form-container sign-in-container">
				<form id='signIn' onSubmit={validateUser}>
					<h1>Sign in</h1>
					<span>using your account</span>
					<input 
						type="username" 
						id='username2'
						name='uname' 
						placeholder={`Username: ${dynamicUserNamePlaceHolder}`} 
						onChange = {(event) => setUserName(event.target.value)}
					/>
					<input 
						type="password" 
						id='password2'
						name='pass' 
						placeholder="Password" 
						onChange = {(event) => setUserPassword(event.target.value)}
					/>
	
					<a href="#">Forgot your password?</a>
					<button type='submit'>Sign In</button>
				</form>
			</div>
			<div className="overlay-container">
				<div className="overlay">
					<div className="overlay-panel overlay-left">
						<h1>Welcome Back!</h1>
						<p>Get back to your conversations?</p>
						<button 
							className="ghost" 
							id="signIn"
							onClick={() => {signInHandleClick()}}
						>Sign In</button>
					</div>
					<div className="overlay-panel overlay-right">
						<h1>Hello!</h1>
						<p>Click to sign up</p>
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
  );
};

export default SignIn;
