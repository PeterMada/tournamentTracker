import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export const Scoreboard = () => {
  const [allScore, setAllScore] = useState([]);

  useEffect(() => {
    const fetchScorebaord = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}scoreboard`,
        {
          method: 'GET',
          headers: { token: localStorage.token },
        }
      );
      const parseRes = await response.json();
      console.log(parseRes);
      setMyGroup(parseRes);
    };

    const personsListResults = fetchScorebaord().catch(console.error);
  }, []);

  return (
    <>
      <h1 className='font-medium leading-tight text-5xl mt-0 mb-2 text-blue-600'>
        Total Scoreboard
      </h1>
      <div className='mt-10'></div>
    </>
  );
};
