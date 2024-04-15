import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom"

import "../styles/NextPage.css"

function NextPage(props) {
  
   
  return (
    <div className="next-button-container">
      <div className="next-left">
      { props.pagenum != 1 ?
        <>
          <Link reloadDocument to={"/search/" + props.artist + "/" + props.album + "/" + (parseInt(props.pagenum) - 1)}>
            <button className="move-page left" id="previous-page" >
              <FontAwesomeIcon icon={faArrowLeft} size="2x"/>
            </button>
          </Link>
        </>
        :
        <>
          
        </>
      }
      </div>
      <p className="page-number">{props.pagenum}</p>
      <div className="next-right">
      { props.result_num === 5 ?
        <>
            <Link reloadDocument to={"/search/" + props.artist + "/" + props.album + "/" + (parseInt(props.pagenum) + 1)}>
              <button className="move-page right" id="next-page">
                <FontAwesomeIcon icon={faArrowRight} size="2x"/>
              </button>
            </Link>
        </>
        :
        <>
          
        </>
      }
      </div>
    </div>
  );
}

export default NextPage;