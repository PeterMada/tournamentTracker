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
      setAllScore(parseRes);
    };

    const personsListResults = fetchScorebaord().catch(console.error);
  }, []);

  return (
    <>
      <h1 className='font-medium leading-tight text-5xl mt-0 mb-2 text-blue-600'>
        Total Scoreboard
      </h1>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Position
              </th>
              <th scope='col' className='px-6 py-3'>
                Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Group
              </th>
              <th scope='col' className='px-6 py-3'>
                Score in group
              </th>
              <th scope='col' className='px-6 py-3'>
                Total Score
              </th>
            </tr>
          </thead>
          <tbody>
            {allScore.map((player, i) => (
              <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                <th
                  scope='row'
                  className='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
                  {i}
                </th>
                <td className='px-6 py-4'>{`${player.user_first_name} ${player.user_last_name}`}</td>
                <td className='px-6 py-4'>4</td>
                <td className='px-6 py-4'>15</td>
                <td className='px-6 py-4'>150</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
