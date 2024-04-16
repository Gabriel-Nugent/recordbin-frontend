import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";

import "./styles/Profile.css"
import ListPreview from './components/ListPreview';
import LoadingPage from './components/LoadingPage';

// connect to server
const client = axios.create({
  baseURL: "https:recordbin-production.up.railway.app/"
})

// styling for modal
const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight:600,
  bgcolor: '#1d1d1d',
  border: '2px solid #595858',
  boxShadow: 24,
  borderRadius: 2,
};

function Profile() {
  const { user_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUserInfo] = useState({});
  const [lists, setLists] = useState([]);
  const [isAuth, setAuth] = useState(false);
  const [newListTitle, setListTitle] = useState("");
  const [newListDescrip, setListDescrip] = useState("");
  const [createListOpen, setCreateListOpen] = useState(false);

  // return user info
  async function get_my_info() {
    try {
      const response = await client.get('/api/profile/',{
        headers: {
          Authorization: `Token ${localStorage.getItem('access_token')}`
        },
      });
      return response.data;
    } catch (error) {
      // Handle error (e.g., display error message)
      console.error('Error fetching user info:', error);
      return null;
    }
  }

  useEffect(() => {
    setLoading(true);

    // in case user is viewing their own profile
    if (user_id == "me" && localStorage.getItem('access_token') !== null) {
      setAuth(true)

      const fetch_data = async () => {
        const data = await get_my_info();
        const user_data = data[0]
        const list_data = data[1]

        // get user's lists
        console.log(list_data)
        let list_components = []
        for (let i = 0; i < list_data.length; i++) {
          list_components.push(<ListPreview
            image={null}
            name={list_data[i].title}
            description={list_data[i].description}
          />) 
        }
        
        setLists(list_components);
        setUserInfo(user_data);
        setLoading(false);
      };
       
      fetch_data().catch(console.error);
    }
    else {

    }

  }, []);

  // functions for handling modal state
  const handleCreateListOpen = () => {
    setCreateListOpen(true);
  }
  const handleCreateListClose = () => {
    setCreateListOpen(false);
  }

  // creates new list on submit
  const handleNewList = async () => {
    const data = {
      "list-title": newListTitle,
      "list-description": newListDescrip,
    }

    console.log(data)

    try {
      const response = await client.post('/listmanager/', data,{
        headers: {
          Authorization: `Token ${localStorage.getItem('access_token')}`
        },
      });
      // reload page to accomodate the new list
      window.location.reload()
    } catch (error) {
      // Handle error (e.g., display error message)
      console.error('Error creating new list:', error);
      return null;
    }
  }

  return (
    <div className="profile">
      <Toolbar signedin={true}/>
      { loading ?
        <LoadingPage />
        :
        <main className="profile-page">
          <div className="profile-content">
            <div className="profile-bio">
              <h1 className="profile-page">{user.username}</h1>
              <div className='profile-image'>
                <FontAwesomeIcon icon={faCircleUser} size='10x'/>
              </div>
              <section className="profile-bio">
                <h2>{user.name}</h2>
                <h4>{user.dob}</h4>
                <h4>{user.location}</h4>
                <h4>Favorite Artists</h4>
                <div className='profile-artists'>
                  {user.favorite_artists}
                </div>
              </section>
            </div>
            <section className="list-area">
              <div className='list-area-header'>
                <div className='empty-div' />
                <h2 className='list-area-header'> {user.username}'s lists </h2>
                { isAuth ?
                  <div className='list-area-button-container'>
                    <Tooltip title="Create a new list" placement='top' arrow>
                      <button onClick={handleCreateListOpen} className='list-area-header'>
                        <FontAwesomeIcon icon={faPlus} size='2x'/>
                      </button>
                      <Modal
                        open={createListOpen}
                        onClose={handleCreateListClose}
                      >
                        <Box sx={boxStyle}>
                        <div className='modal-button-container'>
                          <Button 
                            onClick={handleCreateListClose}
                          >
                          Close
                          </Button>
                        </div>
                        <Typography id="modal-title" variant="h4" component="h2">
                          Create a new List
                        </Typography>
                        <Typography id="modal-description" sx={{ mt: 2, mb: 2}}>
                          Add a title and an optional description
                        </Typography>
                        <Divider />
                        <form className='new-list-form' onSubmit={handleNewList}>
                          <label htmlFor="new-list-form" className='new-list-form'>
                            <h3 className='new-list-form'>Title</h3>
                            <div className='input-area'>
                              <input
                                type='text'
                                className='new-list-form'
                                id='new-list-title'
                                placeholder='My new list!'
                                value={newListTitle}
                                onChange={(e) => setListTitle(e.target.value)}
                              />
                            </div>
                          </label>
                          <label for="new-list-description" className='new-list-form'>
                            <h3 className='new-list-form'>Description</h3>
                            <div className='input-area'>
                              <textarea
                                className='new-list-form' 
                                id='new-list-description'
                                placeholder='A list with many releases...'
                                value={newListDescrip}
                                onChange={(e) => setListDescrip(e.target.value)}
                              />
                            </div>
                          </label>
                          <div className='new-list-form-button-container'>
                            <button className="new-list-form" type='submit'>Create List</button>
                          </div>
                        </form>
                        </Box>
                      </Modal>
                    </Tooltip>
                  </div>
                  :
                  <div className='empty-div' />
                }
              </div>
              <div className='list-previews'>
                {lists}
              </div>
            </section>
          </div>
        </main>
      }
      <Footer/>
    </div>
  );
}

export default Profile;