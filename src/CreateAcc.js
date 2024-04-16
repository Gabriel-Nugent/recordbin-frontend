import { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faKey, faCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import './styles/CreateAcc.css'

import Toolbar from "./components/Toolbar.js";
import Footer from "./components/Footer.js"
import background from "./images/recordbin.png"

const client = axios.create({
  baseURL: "https:recordbin-production.up.railway.app/"
})


/*
  Page for creating a user account 
*/
function CreateAcc() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  // register new user on server
  const handleSubmit = async(event) => {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await client.post('/register/', {
        email: email,
        username: username,
        password: password
      });
      console.log('registration successful:', response.data);

      // Redirect to the home page upon successful registration
      navigate("/");
    } catch (error) {
      console.error('registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  }

  return (
    <div className="CreateAcc">
      <Toolbar signedin = {false} page = {"CreateAcc"}/>
      <div className='CreateAcc-area'>
        <main className="CreateAcc">
          <div className='CreateAcc-input'>
            <h2> Create a New Account </h2>
            <form className='CreateAcc' onSubmit={handleSubmit}>
              <label htmlFor="email" className='CreateAcc'>
                <h3 className='CreateAcc'>Email</h3>
                <div className='input-area'>
                  <FontAwesomeIcon icon={faEnvelope} size='lg'/>
                  <input type='text'
                    className='CreateAcc'
                    id='email'
                    placeholder='ex: thomyorke@email.com'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete=''
                  />
                </div>
              </label><label htmlFor="username" className='CreateAcc'>
                <h3 className='CreateAcc'>Username</h3>
                <div className='input-area'>
                  <FontAwesomeIcon icon={faUser} size='lg'/>
                  <input type='text'
                    className='CreateAcc'
                    id='username'
                    placeholder='ex: BjorkFan01'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete=''
                  />
                </div>
              </label>
              <label htmlFor="password" className='CreateAcc'>
                <h3 className='CreateAcc'>Password</h3>
                <div className='input-area'>
                  <FontAwesomeIcon icon={faKey} size='lg'/>
                  <input type='password'
                    className='CreateAcc' 
                    id='password'
                    placeholder='ex: BiggestThief123!'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </label>
              <label htmlFor="password-confirmation" className='CreateAcc'>
                <h3 className='CreateAcc'>Confirm Password</h3>
                <div className='input-area'>
                  <FontAwesomeIcon icon={faCheck} size='lg'/>
                  <input type='password'
                    className='CreateAcc' 
                    id='password-confirmation'
                    placeholder='ex: BiggestThief123!'
                    value={passwordConfirmation}
                    onChange={e => setPasswordConfirmation(e.target.value)}
                  />
                </div>
              </label>
              <button className="CreateAcc" type='submit' onClick={handleSubmit}> Create Account</button>
              <p className='CreateAcc'> Already have an account? Sign in  
                <Link to="/signin" id="signin-link">Here.</Link>
              </p>
            </form>
          </div>
          <section className="CreateAcc">
            <h1> Welcome to RecordBin. </h1>
            <p> Create an account using your <strong>Email</strong> and a strong <strong>Password</strong> </p>
            <img className="CreateAcc" src={background} />
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default CreateAcc