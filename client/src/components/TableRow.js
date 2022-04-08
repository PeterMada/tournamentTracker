import React from 'react';

export const TableRow = ({ player, i, groupLevel, changeGroupLevel }) => {
  const withEmptyRow = (
    <>
      <tr>
        <td className='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
          {`Group: ${groupLevel}`}
        </td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
        <td
          scope='row'
          className='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
          {i}
        </td>
        <td className='px-6 py-4'>{`${player.user_first_name} ${player.user_last_name}`}</td>
        <td className='px-6 py-4'>
          {player.score_for_rank ? player.score_for_rank : 0}
        </td>
        <td className='px-6 py-4'>
          {player.score_for_game ? player.score_for_game : 0}
        </td>
        <td className='px-6 py-4'>
          {player.score_total_score ? player.score_total_score : 0}
        </td>
      </tr>
    </>
  );

  const row = (
    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
      <td
        scope='row'
        className='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
        {i}
      </td>
      <td className='px-6 py-4'>{`${player.user_first_name} ${player.user_last_name}`}</td>
      <td className='px-6 py-4'>
        {player.score_for_rank ? player.score_for_rank : 0}
      </td>
      <td className='px-6 py-4'>
        {player.score_for_game ? player.score_for_game : 0}
      </td>
      <td className='px-6 py-4'>
        {player.score_total_score ? player.score_total_score : 0}
      </td>
    </tr>
  );

  if (changeGroupLevel) {
    return withEmptyRow;
  }

  return row;
};
