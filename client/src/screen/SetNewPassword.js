import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export const SetNewPassword = ({ setAuth }) => {
  const { user_id, token } = useParams();
  const navigate = useNavigate();
  return (
    <div className='max-w-xl m-auto'>
      <h1 className='font-medium leading-tight text-5xl mt-0 mb-10 text-blue-600'>
        Set new password?
      </h1>
      <Formik
        initialValues={{
          password: '',
          passwordConfirm: '',
        }}
        validate={(values) => {
          const errors = {};

          if (!values.password) {
            errors.password = 'Password Field Cannot be empty';
          } else if (values.password.length < 8) {
            errors.password = 'Password must be 8 characters long';
          }

          if (!values.passwordConfirm) {
            errors.passwordConfirm =
              'Confirm Password Field Cannot be empty';
          }

          if (
            values.password &&
            values.passwordConfirm &&
            values.password !== values.passwordConfirm
          ) {
            errors.passwordConfirm = 'Password must be matching';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}auth/setnewpassword`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  user_id: user_id,
                  token: token,
                },

                body: JSON.stringify(values),
              }
            );

            const parseRes = await response.json();
            if (parseRes.token) {
              localStorage.setItem('token', parseRes.token);
              setAuth(true);
              toast.success('Password changed succesfully');
              navigate(`/dashboard`);
            } else {
              setAuth(false);
              toast.error(parseRes);
            }
          } catch (err) {
            toast.error('Oops, server error!');
          }
        }}>
        {({ isSubmitting, isValid, dirty }) => (
          <Form data-testid='registerForm'>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='password'>
                Password
              </label>
              <Field
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='password'
                name='password'
                type='password'
              />
              <ErrorMessage
                className='text-red-500 text-xs mt-1 ml-1'
                name='password'
                component='div'
              />
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='passwordConfirm'>
                Confirm Password
              </label>
              <Field
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='passwordConfirm'
                name='passwordConfirm'
                type='password'
              />
              <ErrorMessage
                className='text-red-500 text-xs mt-1 ml-1'
                name='passwordConfirm'
                component='div'
              />
            </div>
            <div className='flex flex-col items-end justify-end'>
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

              <Link className='mt-4' to='/login'>
                Login
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
