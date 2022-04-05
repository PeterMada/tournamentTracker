import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export const RecordScore = () => {
  const { id } = useParams();
  const [myGroup, setMyGroup] = useState([]);

  useEffect(() => {
    const fetchMyGroup = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}scoreInfo`,
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

  return (
    <>
      <h1 className='font-medium leading-tight text-5xl mt-0 mb-2 text-blue-600'>
        Record score
      </h1>
      <Formik
        initialValues={{
          scoreFirst: '',
          scoreSecond: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.scoreFirst) {
            errors.scoreFirst = 'Field is required';
          }

          if (!values.scoreSecond) {
            errors.scoreSecond = 'Field is required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}auth/register`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify(values),
              }
            );

            const parseRes = await response.json();
            if (parseRes.token) {
              localStorage.setItem('token', parseRes.token);
              setAuth(true);
              toast.success('Registered succesfully');
            } else {
              setAuth(false);
              toast.error(parseRes);
            }
          } catch (err) {
            toast.error('Oops, failed to fetch!');
          }
        }}>
        {({ isSubmitting, isValid, dirty }) => (
          <Form data-testid='registerForm'>
            <div className='mb-4'>
              <Field
                className='form-select appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                as='select'
                name='targetType'
                aria-label='Target type'>
                <option value='Select target type'>-</option>
                <option value='1'>1</option>
                <option value='2 level'>2</option>
                <option value='3'>3</option>
                <option value='s'>S</option>
              </Field>
              <Field
                className='form-select appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                as='select'
                name='targetType'
                aria-label='Target type'>
                <option value='Select target type'>-</option>
                <option value='1'>1</option>
                <option value='2 level'>2</option>
                <option value='3'>3</option>
                <option value='s'>S</option>
              </Field>
            </div>

            <div className='flex items-center justify-between'>
              {!isSubmitting ? (
                <button
                  className={
                    (!dirty ? 'opacity-50 cursor-not-allowed ' : '') +
                    'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  }
                  type='submit'
                  disabled={!dirty}>
                  Register
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

      <Link to='/login'>Login</Link>
    </>
  );
};
