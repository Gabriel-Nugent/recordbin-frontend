import React from 'react';
import ReactDOM from 'react-dom/client';

import { 
  createBrowserRouter,
  createRoutesFromElements, 
  RouterProvider, 
  Route,
} from "react-router-dom";

import './styles/index.css';
import Home from './Home';
import reportWebVitals from './reportWebVitals';
import SignIn from './SignIn';
import Search from './Search';
import Profile from './Profile';
import CreateAcc from './CreateAcc';
import Release from './Release';
import List from './List'

// Routes to different pages in application
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/recordbin-frontend/'>
      <Route index element={<Home />} />
      <Route path='signin' element={<SignIn />}/>
      <Route path='create-account' element={<CreateAcc/>} />
      <Route path='search/:artist/:album/:pagenum' element={<Search />}/>
      <Route path='release/:group_id/:release_id' element={<Release />}/>
      <Route path='profile/:user_id' element={<Profile />}/>
      <Route path='list/:list_name' element={<List />} />
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

reportWebVitals();
