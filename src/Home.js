import { useState, useEffect } from 'react';

import './styles/Home.css';

import Toolbar from './components/Toolbar'
import Footer from './components/Footer';

function Home() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('access_token') !== null) {
      setIsAuth(true); 
    }
  }, []);

  return (
    <div className="App">
      <Toolbar signedin = {isAuth} page = {"home"}/>
      <main className='home-page'>
        <h1 className='home-text'>
          Welcome to RecordBin.
          <p className='home-text'>
            Search for releases using the search bars at the top of the page.
          </p>
        </h1>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
