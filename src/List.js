import Toolbar from "./components/Toolbar"
import LoadingPage from "./components/LoadingPage";
import Footer from "./components/Footer";
import Result from "./components/Result"

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios'

import "./styles/List.css"

export default function List() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false); 
  const {list_name} = useParams(); 
  const [results, setResults] = useState([]);

  useEffect(() => {
    setLoading(true)

    if (localStorage.getItem('access_token') !== null) {
      setIsAuth(true); 
    }

    async function get_list_albums() {
      return Axios({
        url:"https:recordbin-production.up.railway.app/listchanger/",
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem('access_token')}`
        },
        params:{
          title: list_name
        },
        })
        .then(res => res.data);
    }

    const fetch_data = async () => {
      const data = await get_list_albums();
      const albums = data.albums;

      // //let found = [];
      let releases = [];
      for (let i = 0; i < albums.length; i++) {
        
        console.log(albums[i].ablum_name)

        releases.push(<Result
          id={albums[i].release_id}
          group_id={albums[i].group_id}
          image={albums[i].album_image}
          name={albums[i].album_name}
          artists={albums[i].artist}
          type={""}
          date={albums[i].release_date}
          tags={""}
        />)
      }

      setResults(releases);
      setLoading(false);
    }

    fetch_data()
      .catch(console.error);

  }, []);

  if (loading) {
    return (
      <div className="App">
        <Toolbar signedin = {isAuth} page = {"search"}/>
        <LoadingPage />
        <Footer />
      </div>
    )
  }
  else if (results.length > 0) {
    return (
      <div className="App">
        <Toolbar signedin = {isAuth}/>
        <main id='list-page'>
            <h2 className='list-header'>{list_name}</h2>
            {results}
        </main>
        <Footer />
      </div>
    )
  }
  else {
    return (
      <div className="App">
        <Toolbar signedin = {isAuth}/>
        <main className='no-results'>
          <h1>This list is empty</h1>
        </main>
        <Footer />
      </div>
    )
  }
}


