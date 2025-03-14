import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginRegistrationForm() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [username, setUsername] = useState();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState("");
    const [registerError, setRegisterError] = useState("");
    const [registerMsg, setRegisterMsg] = useState("");
    const [loginMsg, setLoginMsg] = useState("");

    

    const onRegister = (event) => {
        event.preventDefault();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if (!passwordRegex.test(password)) {
            setRegisterError("Password must be at least 8 characters long and include an uppercase letter, lowercase letter, a number, and a special character.");
            return;
        }

        axios.post( 'http://192.168.0.100:5000/api/register/', {username, email, password})
        .then(res => {
            console.log(res.status);
            if(res.status === 201){
                console.log("Login Success");
                alert('Login successful!')
                setRegisterMsg("User Registration was successful. Please login with your creds.")
            }
            else if(res.status === 409){
                setRegisterError("User already registered please login.")
            }
            else{
                setRegisterError('Incorrect password! Please try again.');
            }
        })
        .catch(err => {
        if (err.response && err.response.status === 409) { 
            setRegisterError("User already registered. Please login.");
        } else {
            setRegisterError("Server error! Please try again later.");
        }
        })
    }

    
    const onLogin = (event) => {
        event.preventDefault();
        setLoginError("");
        
        axios.post( 'http://192.168.0.100:5000/api/login/', {username, password})
        .then(res => {
            console.log(res);
            if(res.data.result === "success"){
                console.log("Login Success");
                setLoginMsg("Login successful")
                localStorage.setItem("username", username);
                navigate('/dashboard');
                window.location.reload();
            }
            else{
                setLoginError("Incorrect email or password! Please try again.");
            }
        })
        .catch(err => setLoginError("Server error! Please try again later."));
    };
 

    return (
        <div className="container">
            <div className="input-box">
                <p className="title">Registration</p>
                <form  onSubmit={onRegister}>

                <input type="text" placeholder="Username" onChange={(event) => setUsername(event.target.value)} required/>
                <input type="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} required/>
                <input type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} required minLength={6}/>
                {registerMsg && <div className="message">{registerMsg}</div>}
                {registerError && <div className="error-message">{registerError}</div>}
                <input type={"submit"} style={{ backgroundColor: "#a1eafb" }} />
                </form>

            </div>

            <div className="input-box">
                <p className="title">Login</p>
                <form  onSubmit={onLogin}>
                <input type="text" placeholder="username" required onChange={(event) => setUsername(event.target.value)} />
                <input type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)}/>
                {loginMsg && <div className="message">{loginMsg}</div>}
                {loginError && <div className="error-message">{loginError}</div>}
                
                <input type={"submit"} style={{ backgroundColor: "#a1eafb" }} />
                
                </form>
            </div>
        </div>
        
           
  )
}

export default LoginRegistrationForm;