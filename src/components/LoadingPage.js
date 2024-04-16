import { Bars } from 'react-loader-spinner';

import '../styles/LoadingPage.css'

// page that appears while content is loading
function LoadingPage() {
  return (
    <main id='loading-page'>
        <Bars
          height="80"
          width="80"
          color="#6052ff"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
    </main>
  );
}

export default LoadingPage;