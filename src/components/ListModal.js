import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';

import "../styles/ListModal.css"
import axios from 'axios';

// props are list_cover, list_id, list_title, release_id, group_id, release_cover
export default function ListModal(props) {

  const [status, setStatus] = useState(props.inAlbum)

  const client = axios.create({
    baseURL: "https:recordbin-production.up.railway.app/",
    headers: {
      Authorization: `Token ${localStorage.getItem('access_token')}`
    },
  })

  const ListItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    '&:hover': {
      'background-color': '#1f1b52'
    }
  }

  const add_to_list = async () => {
    let data = {
      "album_cover": props.album_cover,
      "album_name": props.album_name,
      "list_name": props.list_title,
      "release_id": props.release_id,
      "group_id": props.group_id,
      "artists": props.artists
    }
    axios({
      url:"https:recordbin-production.up.railway.app/listchanger/",
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem('access_token')}`
      },
      data : data,
    })
    .then((res) => {})
    .catch((error) => {
      // Handle error (e.g., display error message)
      console.error('Error adding album to list:', error);
      return null;
    })
  }

  const remove_from_list = async () => {
    let data = {
      "list_name": props.list_title,
      "release_id": props.release_id,
    }
    axios({
      url:"https:recordbin-production.up.railway.app/listchanger/",
      method: "DELETE",
      headers: {
        Authorization: `Token ${localStorage.getItem('access_token')}`
      },
      data : data,
    })
    .then((res) => {})
    .catch((error) => {
      // Handle error (e.g., display error message)
      console.error('Error deleting album from list:', error);
      return null;
    })
  }

  const handleChange = async () => {
    if (status == false) {
      add_to_list();
      setStatus(true)
    }
    else {
      remove_from_list();
      setStatus(false)
    }
  }
  
  return (
    <ListItemButton 
      sx={ListItemStyle} 
      className='list-modal-container'
      onClick={handleChange}
    >
      <div className='list-modal-info'>
        <div className='list-modal-image-containter'>
          {props.cover == "No Cover" ?
            <FontAwesomeIcon icon={faList} size='2x'/>
          :
            <img src={props.cover} className='list-modal-picture'/>
          }
        </div>
        <h3 className='list-modal-title'>{props.list_title}</h3>
      </div>
      <div className='list-modal-actions'>
        <Checkbox 
          aria-label='add to list check box'
          checked={status}
          onChange={handleChange}
          sx={{
            color: 'white',
            '&.Mui-checked': {
              color: "#6052ff",
            },
          }}
        />
      </div>
    </ListItemButton>
  )
}