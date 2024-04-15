import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

import './styles/SignIn.css';

import Toolbar from "./components/Toolbar.js";
import Footer from "./components/Footer.js"
import background from "./images/recordbin.png"

const client = axios.create({
  baseURL: "http://127.0.0.1:8000/"
})

function SignIn() {

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await client.post('/login/', {
        identifier: identifier, // Send 'identifier' instead of 'username'
        password: password
      });
      const { token } = response.data;
      // Store the token securely (e.g., in local storage)
      
      localStorage.clear();
      localStorage.setItem('access_token', token);
      
      console.log('Login successful:', response.data);

      // Redirect to the desired page upon successful login
      navigate("/");
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  }

  return (
    <div className="signin">
      <Toolbar signedin = {false} page = {"signin"}/>
      <div className='signin-area'>
        <main className="signin">
          <div className='signin-input'>
            <h2> Login </h2>
            <form className='signin' onSubmit={handleSubmit}>
              <label or="username" className='signin'>
                <h3 className='signin'>Email or Username</h3>
                <div className='input-area'>
                  <FontAwesomeIcon icon={faUser} size='lg'/>
                  <input
                    type='text'
                    className='signin'
                    id='username'
                    placeholder='ex: thomyorke@email.com'
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </label>
              <label for="password" className='signin'>
                <h3 className='signin'>Password</h3>
                <div className='input-area'>
                  <FontAwesomeIcon icon={faKey} size='lg'/>
                  <input
                    type='password'
                    className='signin' 
                    id='password'
                    placeholder='ex: BiggestThief123!'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </label>
              <button className="signin" type='submit'> Login</button>
            </form>
          </div>
          <section className="signin">
            <h1> Welcome Back to RecordBin. </h1>
            <p> log in using your <strong>Email</strong> and <strong>Password</strong> </p>
            <img className="signin" src={background} />
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default SignIn