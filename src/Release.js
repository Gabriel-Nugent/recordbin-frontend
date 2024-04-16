import Axios from 'axios'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { AlbumOutlined, Album } from '@mui/icons-material';
import { styled } from '@mui/material/styles'

import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer"
import Track from "./components/Track"
import ListModal from './components/ListModal';

import "./styles/Release.css";
import LoadingPage from './components/LoadingPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';

// styling for MUI components
const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight:600,
  bgcolor: '#1d1d1d',
  border: '2px solid #595858',
  boxShadow: 24,
  borderRadius: 2,
};

const StyledRating = styled(Rating)({
  '& .MuiRating-icon': {
    color: '#6052ff',
  }
})

const ListenedRating = styled(Rating)({
  '& .MuiRating-icon': {
    color: '#62bfed',
  }
})

function Release() {

  const { group_id, release_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState();
  const [listened, setListLog]  = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [listOpen, setListOpen] = useState();
  const [release_info, setReleaseInfo] = useState();
  const [lists, setLists] = useState();
  const [isAuth, setIsAuth] = useState(false);

  // get information for the release group
  async function get_group_info() {
    
    const search_url = `https://musicbrainz.org/ws/2/release-group/${group_id}?inc=artists+genres`;

    return Axios({
      method: "get",
      url: search_url,
      headers: {
        "Accept": "application/json",
      },

      })
      .then(res => res.data);
  }

  // get information for this particular release in the group
  async function get_release_info() {
    return Axios({
      method: "get",
      url: `http://musicbrainz.org/ws/2/release/${release_id}?inc=recordings`,
      headers: {
        "Accept": "application/json",
      },
    })
    .then(res => res.data)
    .catch((error) => {
      //try to fix the error or
      //notify the users about somenthing went wrong
      console.log(error.message)
    })
  }

  // retrieves the album cover from the cover art archive
  async function get_image() {
    return Axios({
      method: "get",
      url: `https://coverartarchive.org/release/${release_id}`,
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

  // get the lists of the signed in user
  async function get_lists() {
    return Axios({
      method: "get",
      url: `https:recordbin-production.up.railway.app/listmanager/`,
      headers: {
        Authorization: `Token ${localStorage.getItem('access_token')}`
      },
    })
    .then(res => res.data)
    .catch((error) => {
      //try to fix the error or
      //notify the users about somenthing went wrong
      console.log(error.message)
    })
  }

  // get the information of the current user
  async function get_user_info(release_id) {
    return Axios({
      method: "get",
      url: `https:recordbin-production.up.railway.app/ratingmanager/`,
      headers: {
        Authorization: `Token ${localStorage.getItem('access_token')}`,
      },
      params: {
        release: release_id
      }
    })
    .then(res => res.data)
    .catch((error) => {
      //try to fix the error or
      //notify the users about somenthing went wrong
      console.log(error.message)
    })
  }

  // sets the album's rating based on the user's input
  async function set_rating(data) {
    return Axios({
      method: "post",
      url: `https:recordbin-production.up.railway.app/ratingmanager/`,
      headers: {
        Authorization: `Token ${localStorage.getItem('access_token')}`
      },
      data: data,
    })
    .then(res => res.data)
    .catch((error) => {
      //try to fix the error or
      //notify the users about somenthing went wrong
      console.log(error.message)
    })
  }

  // adds or removes the release from the user's listen log
  async function set_status(data) {
    return Axios({
      method: "post",
      url: `https:recordbin-production.up.railway.app/ratingmanager/`,
      headers: {
        Authorization: `Token ${localStorage.getItem('access_token')}`
      },
      data: data,
    })
    .then(res => res.data)
    .catch((error) => {
      //try to fix the error or
      //notify the users about somenthing went wrong
      console.log(error.message)
    })
  }

  // fetch all relevant data on page load
  useEffect(() => {
    setLoading(true)

    const fetch_data = async () => {
      const group_info = await get_group_info();
      const release_info = await get_release_info();
      const cover_info = await get_image();

      let artists = "";
      for (let i = 0; i < group_info["artist-credit"].length; i++) {
        artists += group_info["artist-credit"][i].name + group_info["artist-credit"][i].joinphrase;
      }

      let genres = "";
      for (let i = 0; i < group_info["genres"].length && i < 4; i++) {
        genres += group_info["genres"][i].name;
        if (i < group_info["genres"].length - 1 && i < 3) {
          genres += ", ";
        }
      }

      let cover = "";
      if (cover_info == undefined) {
        cover = "No Cover!";
      }
      else {
        cover = cover_info[0].image;
      }

      // format all tracks in this release
      let track_components = [];
      const tracks = release_info.media[0].tracks;
      for (let i = 0; i < tracks.length; i++) {
        // get the length of the track
        let time = (tracks[i]["length"]) / 60000;
        const time_str = parseInt(time).toString() + ":" + parseInt((time % 1)*60).toString();
        
        track_components.push(<Track 
          position={tracks[i].position}
          title={tracks[i].title}
          length={time_str}
        />)
      }

      const release_data = {
        "title": group_info.title,
        "artists": artists,
        "date": group_info["first-release-date"],
        "genres": genres,
        "type": group_info["primary-type"],
        "cover": cover,
        "tracks": track_components
      }

      // get user data
      if (localStorage.getItem('access_token') != null) {
        setIsAuth(true); 

        const user_info = await get_user_info(release_id);
        console.log(user_info)

        if (user_info != null) {
          setRating(user_info.rating / 2)
          setListLog(user_info.status)
        }

        const list_info = await get_lists();

        // format all user's lists
        let list_components = []
        console.log(list_info)
        for (let i = 0; i < list_info.length; i++) {
          
          let inAlbum = false;
          if (list_info[i].albums != null) {
            for (let j = 0; j < list_info[i].albums.length; j++) {
              if (list_info[i].albums[j].release_id == release_id) {
                inAlbum = true;
                break;
              }
            }
          }

          list_components.push(
            <>
              <ListModal 
                list_title={list_info[i].title}
                release_id={release_id}
                group_id={group_id}
                inAlbum={inAlbum}
                album_cover={cover}
                cover={"No Cover"}
                album_name={group_info.title}
                artists={artists}
              />
              <Divider className='divider' component = 'li' />
            </>
          )
        }

        setUserInfo(user_info);
        setLists(list_components);
      }
      setReleaseInfo(release_data);
      setLoading(false);
    }

    fetch_data()
      .catch(console.error);

  }, []);

  // handle modal state change
  const handleOpen = () => {
    setListOpen(true);
  }
  const handleClose = () => {
    setListOpen(false);
  }

  return (
    <div className="release-page">
    <Toolbar signedin={isAuth} />
    {loading ?
      <LoadingPage />
      :
      <main className="release-page"> 
        <div className="release-page-upper">
          <div className='release-image-container'>
            { release_info.cover === "No Cover!" ?
              <FontAwesomeIcon icon={faCompactDisc} size='10x'/>
              :
              <img 
                className="release-page" 
                src={release_info.cover}
                alt={`cover art for ${release_info.title}`}
              />
            }
          </div>
          <section className="release-info">
            <h1>{release_info.title}</h1>
            <h2>{release_info.artists}</h2>
            <p>{release_info.type}</p>
            <p>{release_info.date}</p>
            <p>{release_info.genres}</p>
          </section>
        </div>
        <h2 className='tracks'>Tracks</h2>
        <div className="release-page-lower">
          <section className="release-tracks">
            <div className="release-track-container">
              {release_info.tracks}
            </div>
          </section>
          { isAuth ?
            <section className="release-actions">
              <div className='release-icons'>
                <Tooltip title="Add to listen log" placement='top' arrow>
                  <ListenedRating
                    size='large'
                    id="listened" 
                    name="listened" 
                    defaultValue={listened} 
                    precision={1}
                    max={1}
                    value={listened}
                    onChange={(e,new_status) => {
                      const data = {
                        "release_id": release_id,
                        "group_id": group_id,
                        "album_name": release_info["title"],
                        "album_cover": release_info["cover"],
                        "artists": release_info["artists"],
                        "rating": 0,
                      }
                      set_status(data)
                      setListLog(new_status);
                    }}
                    icon={<Album fontSize='inherit'/>}
                    emptyIcon={
                      <AlbumOutlined 
                        fontSize="inherit"
                        style={
                          {color: "white"}
                        }
                      />
                    }
                  />
                </Tooltip>
              </div>
              <button 
                className="release-actions" 
                id="add-to-list"
                onClick={handleOpen}
              >
                Add to List
              </button>
                <Tooltip title="Give this release a rating" placement='bottom' arrow>
                  <StyledRating 
                    id="rating" 
                    name="rating" 
                    defaultValue={rating} 
                    precision={0.5}
                    value={rating}
                    onChange={(e,new_rating) => {
                      const data = {
                        "release_id": release_id,
                        "group_id": group_id,
                        "album_name": release_info["title"],
                        "album_cover": release_info["cover"],
                        "artists": release_info["artists"],
                        "rating": parseInt(new_rating * 2),
                      }
                      set_rating(data);
                      setRating(new_rating);
                    }} 
                    emptyIcon={
                      <StarBorderIcon 
                        fontSize="inherit"
                        style={
                          {color: "white"}
                        }
                      />
                    }
                  />
                </Tooltip>
              <Modal
                open={listOpen}
                onClose={handleClose}
              >
                <Box sx={boxStyle}>
                <div className='modal-button-container'>
                  <Button 
                    onClick={handleClose}
                  >
                  Close
                  </Button>
                </div>
                <Typography id="modal-title" variant="h4" component="h2">
                  Your Lists
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2, mb: 2}}>
                  Select the list(s) you wish to add to.
                </Typography>
                <List id="lists">
                  <Divider className='divider' component="li" />
                  {lists}
                </List>
                </Box>
              </Modal>
            </section>
            :
            <></>
          }
        </div>
      </main>
    }
    <Footer />
    </div>
  )
}

export default Release;