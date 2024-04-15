import { useParams } from 'react-router-dom';
import Axios from 'axios'

import './styles/Search.css';

import Toolbar from './components/Toolbar'
import LoadingPage from './components/LoadingPage';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import { useState, useEffect } from 'react';
import NextPage from './components/NextPage';

function Search() {
  const { album, artist, pagenum } = useParams();
  const [results, setResults] = useState();
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  async function get_results() {
    let search_url;
    const artist_query = artist;
    const album_query = album;
    
    if (artist === "any") {
      search_url = `https://musicbrainz.org/ws/2/release-group/?query=release:${album_query}&inc=genres&limit=5&offset=${(pagenum-1)*5}`;
    }
    else if (album === "any") {
      search_url = `https://musicbrainz.org/ws/2/release-group/?query=artist:${artist_query}&inc=genres&limit=5&offset=${(pagenum-1)*5}`;
    }
    else {
      search_url = `https://musicbrainz.org/ws/2/release-group/?query=release:${album_query}%20AND%20artist:${artist_query}&inc=genres&limit=5&offset=${(pagenum-1)*5}`;
    }

    return Axios({
      method: "get",
      url: search_url,
      headers: {
        "Accept": "application/json",
      },

      })
      .then(res => res.data);
  }

  async function get_image(release) {
      return Axios({
        method: "get",
        url: `https://coverartarchive.org/release/${release.id}`,
        headers: {
          "Accept": "application/json",
        },
        validateStatus : false,
      })
      .then(res => res.data.images)
      .catch((error) => {
        //try to fix the error or
        //notify the users about somenthing went wrong
        console.log(error.message)
      })
  }

  useEffect(() => {
    setLoading(true)

    if (localStorage.getItem('access_token') !== null) {
      setIsAuth(true); 
    }

    const fetch_data = async () => {
      const data = await get_results();
      const release_groups = data["release-groups"];
      
      console.log(release_groups);

      //let found = [];
      let releases = [];
      for (let i = 0; i < release_groups.length; i++) {
        
        const group = release_groups[i];
        const release_data = group.releases[0]
        
        if (group.score < 60) {
          break;
        }

        // get artists of release
        let artists = ""
        for (let j = 0; j < group["artist-credit"].length; j++) {
          artists += group["artist-credit"][j].name
          if (j < group["artist-credit"].length - 1) {
            artists += ", ";
          }
        }

        let tags = ""
        if (group.hasOwnProperty("tags")) {
          for (let j = 0; j < group.tags.length && j < 6; j++) {
            tags += group.tags[j].name;
            if (j < group.tags.length - 1 && j < 6) {
              tags += ", ";
            }
          }
        }

        const release = {
          "id": release_data.id,
          "group_id": group.id,
          "name": release_data.title,
          "artists": artists,
          "date": group["first-release-date"],
          "type": group["primary-type"],
          "tags": tags,
        }

        releases.push(release)
      }

      for (let i in releases) {
        const images = await get_image(releases[i]);

        if (images == undefined) {
          releases[i]["image"] = "No Cover!";
        }
        else {
          releases[i]["image"] = images[0].image;
        }
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
        <Toolbar signedin = {isAuth} page = {"search"}/>
        <main id='results-page'>
            <h2 className='search-header'>Results for "{album}" by "{artist}"</h2>
            <NextPage
              pagenum={pagenum}
              result_num={results.length}
              artist={artist}
              album={album}
            />
            <SearchResults 
              data={results}
              pagenum={pagenum}
            />
            <NextPage
              pagenum={pagenum}
              result_num={results.length}
              artist={artist}
              album={album}
            />
          </main>
        <Footer />
      </div>
    )
  }
  else {
    return (
      <div className="App">
        <Toolbar signedin = {isAuth} page = {"search"}/>
        <main className='no-results'>
          <h1>No Results for "{album}" by "{artist}"</h1>
        </main>
        <Footer />
      </div>
    )
  }
}

export default Search;
