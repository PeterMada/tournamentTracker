import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export const Dashboard = ({ setAuth }) => {
  const [myGroup, setMyGroup] = useState([]);
  const [users, setUsers] = useState([]);

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
      setMyGroup(parseRes.myGroup);
      setUsers(parseRes.users);
    };

    const personsListResults = fetchMyGroup().catch(console.error);
  }, []);

  console.log(users);

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

      {myGroup ? (
        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Player one
                </th>
                <th scope='col' className='px-6 py-3'>
                  Player two
                </th>
                <th scope='col' className='px-6 py-3'>
                  First player email
                </th>
                <th scope='col' className='px-6 py-3'>
                  Second player email
                </th>
                <th scope='col' className='px-6 py-3'>
                  Score
                </th>
                <th scope='col' className='px-6 py-3'>
                  <span className='sr-only'>Add score</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {myGroup.map((group, i) => {
                let firstPlayerObj = users.find(
                  (e) => e.user_id === group.sr_player_one_id
                );

                let secondPlayerObj = users.find(
                  (e) => e.user_id === group.sr_player_two_id
                );

                return (
                  <tr
                    key={group.sr_id}
                    className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    <th
                      scope='row'
                      className='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
                      {firstPlayerObj
                        ? `${firstPlayerObj.user_first_name} ${firstPlayerObj.user_last_name}`
                        : ''}
                    </th>
                    <td className='px-6 py-4'>
                      {secondPlayerObj
                        ? `${secondPlayerObj.user_first_name} ${secondPlayerObj.user_last_name}`
                        : ''}
                    </td>
                    <td className='px-6 py-4'>
                      {firstPlayerObj
                        ? `${firstPlayerObj.user_email}`
                        : ''}
                    </td>
                    <td className='px-6 py-4'>
                      {firstPlayerObj
                        ? `${secondPlayerObj.user_email}`
                        : ''}
                    </td>
                    <td className='px-6 py-4 '>
                      <span className='font-medium'>
                        {`${group.sr_player_one_score}:${group.sr_player_two_score}`}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      {group.sr_player_one_score != '-' ? (
                        ''
                      ) : (
                        <Link
                          to={`/recordScore/${group.sr_id}`}
                          className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>
                          Add score
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>You are not in any group</p>
      )}

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
