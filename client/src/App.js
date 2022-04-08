import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
  Redirect,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Register } from '../src/screen/Register';
import { Login } from '../src/screen/Login';
import { Dashboard } from '../src/screen/Dashboard';
import { Scoreboard } from './screen/Scoreboard';
import { RecordScore } from './screen/RecordScore';
import { Forgotpassword } from './screen/Forgotpassword';
import { SetNewPassword } from './screen/SetNewPassword';

toast.configure();

export const App = () => {
  const [isAuthenticated, setsAuthenticated] = useState(false);
  const setAuth = (boolean) => {
    setsAuthenticated(boolean);
  };

  const isAuth = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}auth/verify`,
        {
          metod: 'GET',
          headers: { token: localStorage.token },
        }
      );

      const parseRes = await response.json();
      parseRes === true
        ? setsAuthenticated(true)
        : setsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    isAuth();
  });

  return (
    <BrowserRouter>
      <div className='container max-w-5xl mx-auto m-8 bg-white py-8'>
        <Routes>
          <Route
            exact
            path='/'
            index
            element={
              !isAuthenticated ? (
                <Login setAuth={setAuth} />
              ) : (
                <Navigate replace to='/dashboard' />
              )
            }
          />
          <Route
            exact
            path='/login'
            element={
              !isAuthenticated ? (
                <Login setAuth={setAuth} />
              ) : (
                <Navigate replace to='/dashboard' />
              )
            }
          />
          <Route
            exact
            path='/register'
            element={
              !isAuthenticated ? (
                <Register setAuth={setAuth} />
              ) : (
                <Navigate replace to='/login' />
              )
            }
          />
          <Route
            exact
            path='/dashboard'
            element={
              isAuthenticated ? (
                <Dashboard setAuth={setAuth} />
              ) : (
                <Navigate replace to='/login' />
              )
            }
          />
          <Route
            exact
            path='/scoreboard'
            element={
              isAuthenticated ? (
                <Scoreboard />
              ) : (
                <Navigate replace to='/login' />
              )
            }
          />
          <Route
            exact
            path='/recordScore/:id'
            element={
              isAuthenticated ? (
                <RecordScore />
              ) : (
                <Navigate replace to='/login' />
              )
            }
          />
          <Route
            exact
            path='/forgotpassword'
            element={
              isAuthenticated ? (
                <Navigate replace to='/dashboard' />
              ) : (
                <Forgotpassword />
              )
            }
          />
          <Route
            exact
            path='/setnewpassword/:token'
            element={
              isAuthenticated ? (
                <Navigate replace to='/dashboard' />
              ) : (
                <SetNewPassword setAuth={setAuth} />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
