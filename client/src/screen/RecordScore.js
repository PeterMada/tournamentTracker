import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export const RecordScore = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const [myGroup, setMyGroup] = useState([]);
  const [users, setUsers] = useState([]);
  const [firstPlayer, setFirstPlayer] = useState({});
  const [secondPlayer, setSecondPlayer] = useState({});

  useEffect(() => {
    const fetchMyGroup = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}scoreInfo`,
        {
          method: 'GET',
          headers: { token: localStorage.token, score_id: id },
        }
      );
      const parseRes = await response.json();
      console.log(parseRes);
      setMyGroup(parseRes.scoreGroup);
      setUsers(parseRes.users);
    };

    const personsListResults = fetchMyGroup().catch(console.error);
  }, []);

  useEffect(() => {
    if (users) {
      let firstPlayerObj = users.find(
        (e) => e.user_id === myGroup.sr_player_one_id
      );
      setFirstPlayer(firstPlayerObj);

      let secondPlayerObj = users.find(
        (e) => e.user_id === myGroup.sr_player_two_id
      );
      setSecondPlayer(secondPlayerObj);
    }
  }, [users]);

  return (
    <>
      <h1 className='font-medium leading-tight text-5xl mt-0 mb-10 text-blue-600'>
        Record score
      </h1>
      <Formik
        initialValues={{
          playerOneScore: '-',
          playerTwoScore: '-',
        }}
        validate={(values) => {
          const errors = {};
          if (
            values.playerOneScore === '-' ||
            values.playerTwoScore === '-'
          ) {
            errors.playerOneScore = 'Score is required';
          }

          if (
            values.playerOneScore === 's' &&
            (values.playerTwoScore === '1' ||
              values.playerTwoScore === '2')
          ) {
            errors.playerOneScore =
              'Scratch score could be only S:S, S:3 or 3:S';
          }

          if (
            values.playerTwoScore === 's' &&
            (values.playerOneScore === '1' ||
              values.playerOneScore === '2')
          ) {
            errors.playerTwoScore =
              'Scratch score could be only S:S, S:3 or 3:S';
          }
          console.log(errors);
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}saveScore`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  firstPlayerId: firstPlayer.user_id,
                  secondPlayerId: secondPlayer.user_id,
                  scoreId: id,
                },

                body: JSON.stringify(values),
              }
            );

            const parseRes = await response.json();
            if (parseRes.sr_id) {
              toast.success('Score saved succesfully');
              navigate(`/dashboard`);
            } else {
              toast.error(parseRes);
            }
          } catch (err) {
            toast.error('Oops, server error!');
          }
        }}>
        {({ isSubmitting, isValid, dirty }) => (
          <Form data-testid='registerForm'>
            <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
              <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='px-6 py-3'>
                      Player one
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Score
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Player two
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='px-6 py-4'>
                      {' '}
                      {firstPlayer
                        ? `${firstPlayer.user_first_name} ${firstPlayer.user_last_name}`
                        : ''}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-row items-center'>
                        <Field
                          className='w-10 text-center form-select appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                          as='select'
                          id='playerOneScore'
                          name='playerOneScore'
                          aria-label='Target type'>
                          <option value='-'>-</option>
                          <option value='0'>0</option>
                          <option value='1'>1</option>
                          <option value='2'>2</option>
                          <option value='3'>3</option>
                          <option value='s'>S</option>
                        </Field>
                        <span className='block font-black ml-3 mr-3'>
                          :
                        </span>
                        <Field
                          className='w-10 text-center form-select appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                          as='select'
                          id='playerTwoScore'
                          name='playerTwoScore'
                          aria-label='Target type'>
                          <option value='-'>-</option>
                          <option value='0'>0</option>
                          <option value='1'>1</option>
                          <option value='2'>2</option>
                          <option value='3'>3</option>
                          <option value='s'>S</option>
                        </Field>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      {' '}
                      {secondPlayer
                        ? `${secondPlayer.user_first_name} ${secondPlayer.user_last_name}`
                        : ''}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <ErrorMessage
                className='text-red-500 text-xs mt-4 mb-5 ml-4'
                name='playerOneScore'
                component='div'
              />
              <ErrorMessage
                className='text-red-500 text-xs mt-4 mb-5 ml-4'
                name='playerTwoScore'
                component='div'
              />
            </div>
            <div className='flex items-center justify-between mt-4'>
              {!isSubmitting ? (
                <button
                  className={
                    (!dirty ? 'opacity-50 cursor-not-allowed ' : '') +
                    'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  }
                  type='submit'
                  disabled={!dirty}>
                  Save
                </button>
              ) : (
                <span
                  className='inline-flex items-center px-4 py-2 font-bold leading-6  shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed'
                  data-testid='processBtn'>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Processing...
                </span>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
