'use client';

import api from '@/utils/api';
import styles from './page.module.scss';
import TextInput from '@/components/TextInput';
import { ChangeEvent, useState } from 'react';
import { regex } from '@/utils/regex';
import { redirect, useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthProvider';

export default function Login() {
  const router = useRouter();
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [display, setDisplay] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string>('');
  const [confirmationError, setConfirmationError] = useState<string | null>(
    null
  );

  const handleClick = async () => {
    setLoading(true);
    if (username.length <= 0) {
      setUsernameError('Username is required.');
    }
    if (email.length <= 0) {
      setEmailError('Email is required.');
    }
    if (password.length <= 0) {
      setPasswordError('Password is required.');
    }
    if (confirmation.length <= 0) {
      setConfirmationError('Confirmation is required.');
    }

    if (
      (display === 'register' && username.length <= 0) ||
      email.length <= 0 ||
      password.length <= 0 ||
      (display === 'register' && confirmation.length <= 0)
    ) {
      setLoading(false);
      return;
    }

    if (display === 'login') {
      await auth
        .login(email, password)
        .then(() => {
          console.log('Login success !');
          setLoading(false);
          router.push('/dashboard');
        })
        .catch((err) => {
          console.log('Error login !', err);
        });
    }
    if (display === 'register') {
      await auth
        .register(username, email, password)
        .then(() => {
          console.log('Register success !');
          setLoading(false);
          router.push('/dashboard');
        })
        .catch((err) => {
          console.log('Error signing up !', err);
        });
    }
  };

  const handleOnChange = (value: string, state: string) => {
    const isValid = (regex: RegExp) => new RegExp(regex).test(value);

    switch (state) {
      case 'username':
        setUsername(value);
        if (!isValid(regex.names)) {
          setUsernameError(
            'Invalid username format. Only letters and start with an uppercase one !'
          );
        } else {
          setUsernameError(null);
        }
        break;
      case 'email':
        setEmail(value);
        if (!isValid(regex.email)) {
          setEmailError('Invalid email format. Please check and try again.');
        } else {
          setEmailError(null);
        }
        break;
      case 'password':
        setPassword(value);
        if (!isValid(regex.password)) {
          setPasswordError(
            'At least one uppercase letter, one lowercase letter, one number and 8 characters.'
          );
        } else {
          setPasswordError(null);
        }
        break;
      case 'confirmation':
        console.log(value, password);
        setConfirmation(value);
        if (value !== password) {
          setConfirmationError('Confirmation does not match your password.');
        } else {
          setConfirmationError(null);
        }
        break;
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={(e) => e.preventDefault()}>
        {display === 'register' && (
          <TextInput
            title='Username'
            type='text'
            errorMessage={usernameError}
            content={username}
            handleChange={(e) => handleOnChange(e.target.value, 'username')}
          />
        )}
        <TextInput
          title='Email'
          type='text'
          errorMessage={emailError}
          content={email}
          handleChange={(e) => handleOnChange(e.target.value, 'email')}
        />
        <TextInput
          title='Password'
          type='password'
          errorMessage={passwordError}
          content={password}
          handleChange={(e) => handleOnChange(e.target.value, 'password')}
        />
        {display === 'register' && (
          <TextInput
            title='Confirmation'
            type='password'
            errorMessage={confirmationError}
            content={confirmation}
            handleChange={(e) => handleOnChange(e.target.value, 'confirmation')}
          />
        )}
        <button type='submit' onClick={handleClick}>
          {loading ? (
            <div className={styles.loader} />
          ) : display === 'login' ? (
            'Sign In'
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
      {display === 'register' ? (
        <p className={styles.switch}>
          Already a good doge ?{' '}
          <span onClick={() => setDisplay('login')}>Sign In !</span>
        </p>
      ) : (
        <p className={styles.switch}>
          You don't have a doge account ?{' '}
          <span onClick={() => setDisplay('register')}>Sign Up !</span>
        </p>
      )}
    </div>
  );
}
