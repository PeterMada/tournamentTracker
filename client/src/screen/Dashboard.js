import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export const Dashboard = ({ setAuth }) => {
  const [myGroup, setMyGroup] = useState([]);

  useEffect(() => {
    const fetchMyGroup = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}myGroup`,
        {
          method: 'GET',
          headers: { token: localStorage.token },
        }
      );
      const parseRes = await response.json();
      console.log(parseRes);
      setMyGroup(parseRes);
    };

    const personsListResults = fetchMyGroup().catch(console.error);
  }, []);

  console.log(myGroup);

  const handleStartNewSeason = async (e) => {
    e.preventDefault();
    console.log('new Season');

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}createNewRound`,
      {
        method: 'GET',
        headers: { token: localStorage.token },
      }
    );
    const parseRes = await response.json();
    console.log(parseRes);
    if (parseRes) {
      toast.success('New season started sucessfully');
    } else {
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <h1 className='font-medium leading-tight text-5xl mt-0 mb-2 text-blue-600'>
        Dashboard for {name}
      </h1>
      <div className='mt-10'>
        <Link
          className='bg-blue-500 ml-2 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          to='/newSeason'
          onClick={handleStartNewSeason}>
          Start new season
        </Link>

        <Link
          className='bg-blue-500 ml-2 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          to='/scoreboard'>
          Show scoreboard
        </Link>
      </div>
    </>
  );
};
