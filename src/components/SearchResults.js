import { useEffect } from "react";
import Result from './Result.js'

function SearchResults(props) {

  const render_results = () => {
    const amt_per_page = 10;
    let results = [];
    const data = props.data;

    for (let i = 0; i < amt_per_page && i < data.length; i++) {
      results.push(<Result 
        id={data[i].id}
        group_id={data[i].group_id}
        image={data[i].image}
        name={data[i].name}
        artists={data[i].artists}
        type={data[i].type}
        date={data[i].date}
        tags={data[i].tags}
      />)
    }

    return results
  }

  return (
    <div>
      {render_results()}
    </div>
  )
  
}

export default SearchResults;