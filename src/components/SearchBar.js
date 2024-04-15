import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import Tooltip from '@mui/material/Tooltip';

import '../styles/SearchBar.css'

const SearchBar = () => {
  const [artist_name, set_artist] = useState("");
  const [album_name, set_album] = useState("");
  const navigate = useNavigate();

  const search = (e) => {
    e.preventDefault();

    let artist_param = artist_name;

    // check for empty input
    if (artist_param === "") {
      artist_param = "any";
    }
    else {
      // replace spaces with '-' and convert to lowercase
      artist_param = encodeURI(artist_param);
    }

    // encode album parameter in url
    let album_param = album_name;
    // check for empty album parameter
    if (album_param === "") {
      album_param = "any";
    }

    if (album_param === "any" && artist_param === "any") {
      return;
    }

    album_param = encodeURI(album_param);

    navigate(`/search/${artist_param}/${album_param}/1`, {reloadDocument: true});

    window.location.reload();
  }

  const handleEnter = (e) => {
    if(e.keyCode == 13) {
      search(e);
    }
  }

  return(
    <form onSubmit={search} className='searchbar'>
      <Tooltip title="Search for releases by this Artist" arrow>
        <label className="artist-bar" htmlFor="artist-search">
          <input className='artist-bar bar'
            type='search'
            autoComplete='off'
            minLength={3}
            placeholder='Artist Name'
            autoCorrect="off" 
            autoCapitalize="off" 
            spellCheck="false"
            name='artist-search'
            id='artist-search'
            inputMode='search'
            onKeyDown={handleEnter}
            value={artist_name}
            onChange={e => set_artist(e.target.value)}
          />
        </label>
      </Tooltip>
      <Tooltip title="Search for releases with this title" arrow>
        <label className="album-bar" htmlFor='album-search'>
          <input className='album-bar bar'
            type='search'
            autoComplete='off'
            minLength={3}
            placeholder='Album Name'
            autoCorrect="off" 
            autoCapitalize="off" 
            spellCheck="false"
            name='album-search'
            id='album-search'
            inputMode='search'
            onKeyDown={handleEnter}
            value={album_name}
            onChange={e => set_album(e.target.value)}
          />
        </label>
      </Tooltip>
      <Tooltip title="Submit search" arrow>
        <button className='search-button'
            type='submit' 
            id='search-submit'
            name='submit search button'
            onClick={e => search(e)}>
              <FontAwesomeIcon icon={faMagnifyingGlass} size='xl'/>
        </button>
      </Tooltip>
    </form>
  )
};

export default SearchBar;