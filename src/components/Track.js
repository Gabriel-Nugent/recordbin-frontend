import "../styles/Track.css"

function Track(props) {
  return (
    <div className="track-container">
      <div className="track-left">
        <p className="track-number track">
          {props.position}
        </p>
        <p className="track-name track">
          {props.title}
        </p>
      </div>
      <p className="track-length track">
        {props.length}
      </p>
    </div>
  )
}

export default Track;