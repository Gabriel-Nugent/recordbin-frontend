import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from "@fortawesome/free-solid-svg-icons";

import '../styles/ListPreview.css'

function ListPreview(props) {
  return (
    <div className="list-preview">
      <div className="list-preview-image">
        {props.image === null ?
          <FontAwesomeIcon icon={faList} size='4x'/>
          :
          <img src={props.image}/>
        }
      </div>
      <section className="list-preview">
        <h3>{props.name}</h3>
        <p>{props.description}</p>
      </section>
    </div>
  )
}

export default ListPreview;