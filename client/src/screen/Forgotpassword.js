import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export const Forgotpassword = () => {
  const navigate = useNavigate();
  return (
    <div className='max-w-xl m-auto'>
      <h1 className='font-medium leading-tight text-5xl mt-0 mb-10 text-blue-600'>
        Forgot password?
      </h1>
      <p className='mb-4'>
        Please enter your email to search for your account.
      </p>
      <Formik
        initialValues={{
          email: '',
        }}
        validate={(values) => {
          const errors = {};

          if (!values.email) {
            errors.email = 'Email field is required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}auth/forgotpassword`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify(values),
              }
            );

            const parseRes = await response.json();
            if (parseRes.alright) {
              toast.success('Email send succesfully');
              navigate(`/login`);
            } else {
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
                htmlFor='email'>
                Email
              </label>
              <Field
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='email'
                name='email'
                type='email'
              />
              <ErrorMessage
                className='text-red-500 text-xs mt-1 ml-1'
                name='email'
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
                  Send
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
