import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';

import "../styles/ListModal.css"

// props are list_cover, list_id, list_title, release_id, group_id, release_cover
export default function ListModal(props) {

  const [status, setStatus] = useState(false)

  const ListItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    '&:hover': {
      'background-color': '#1f1b52'
    }
  }

  const add_to_list = async () => {

  }

  const remove_from_list = async () => {

  }

  const handleChange = () => {
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