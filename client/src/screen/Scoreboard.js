import React, { useState, useEffect } from 'react';
import { ExportJsonCsv } from 'react-export-json-csv';

import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { TableRow } from '../components/TableRow';

export const Scoreboard = () => {
  const [allScore, setAllScore] = useState([]);
  const [roundDetail, setRoundDetail] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [fileTitle, setFileTitle] = useState('');

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
      console.log(parseRes.users);
      if (parseRes.users) {
        let test = parseRes.users
          .concat(parseRes.users)
          .concat(parseRes.users)
          .concat(parseRes.users)
          .concat(parseRes.users[2]);

        setAllScore(test);
        //setAllScore(parseRes.users);
        setRoundDetail(parseRes.currentRound);
        setFileTitle(`Total Scoreboard for round
        ${parseRes.currentRound.round_month}. ${parseRes.currentRound.round_year}`);

        const data = parseRes.users.map((player, i) => {
          const sForRank = player.score_for_rank
            ? player.score_for_rank
            : 0;
          const sForGroup = player.score_for_game
            ? player.score_for_game
            : 0;
          const sForTotal = player.score_total_score
            ? player.score_total_score
            : 0;

          return {
            id: i + 1,
            fname: `${player.user_first_name} ${player.user_last_name}`,
            sRank: sForRank,
            sGroup: sForGroup,
            sTotal: sForTotal,
          };
        });
        setCsvData(data);
      }
    };

    const personsListResults = fetchScorebaord().catch(console.error);
  }, []);

  const handlePreviousRound = () => {};

  const headers = [
    {
      key: 'id',
      name: 'Position',
    },
    {
      key: 'fname',
      name: 'Name',
    },
    {
      key: 'sRank',
      name: 'Score for rank',
    },
    {
      key: 'sGroup',
      name: 'Score for group',
    },
    {
      key: 'sTotal',
      name: 'Total score',
    },
  ];

  let groupLevel = 0;

  return allScore.length < 1 ? (
    <p>Loading....</p>
  ) : (
    <>
      <h1 className='font-medium leading-tight text-5xl mt-0 mb-10 text-blue-600'>
        Total Scoreboard for round{' '}
        {`${roundDetail.round_month}. ${roundDetail.round_year}`}
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
                Score for rank
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
            {allScore.map((player, i) => {
              let changeGroupLevel = false;
              const numberOfGroups =
                allScore.length > 5 ? ~~(allScore.length / 5) : 1;
              const numberOfPlayersInLastGroup = allScore.length % 5;

              if (
                numberOfGroups === groupLevel &&
                numberOfPlayersInLastGroup < 3
              ) {
                // do not change group
              } else {
                if (i % 5 === 0) {
                  groupLevel++;
                  changeGroupLevel = true;
                }
              }

              return (
                <TableRow
                  key={`${player.score_player_id}-${i}`}
                  player={player}
                  i={i + 1}
                  groupLevel={groupLevel}
                  changeGroupLevel={changeGroupLevel}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className='mt-6'>
        <ExportJsonCsv
          className={
            'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          }
          fileTitle={fileTitle}
          headers={headers}
          items={csvData}>
          Export
        </ExportJsonCsv>
      </div>
    </>
  );
};
