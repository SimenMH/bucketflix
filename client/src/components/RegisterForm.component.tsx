import { useState } from 'react';
import { useAppDispatch } from '../redux/Hooks';
import { userRegister } from '../redux/User/UserSlice';
import { History } from 'history';

interface Props {
  history: History;
}

const RegisterForm: React.FC<Props> = ({ history }) => {
  // Redux
  const dispatch = useAppDispatch();

  // React States
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      newEmail: { value: string };
      newUsername: { value: string };
      newPassword: { value: string };
      confirmPassword: { value: string };
    };

    if (target.newPassword.value !== target.confirmPassword.value) {
      setErrorText('Passwords must match');
      return;
    }

    const res = await dispatch(
      userRegister({
        email: target.newEmail.value,
        username: target.newUsername.value,
        password: target.newPassword.value,
      })
    );

    if (res.meta.requestStatus === 'rejected') {
      if (res.payload && res.payload.message) {
        setErrorText(res.payload.message);
      } else {
        setErrorText('Unknown error occured, please try again later.');
      }
    } else {
      history.push('/verify-email');
    }
  };

  return (
    <>
      <form className='LoginRegister__Form' onSubmit={handleRegister}>
        <label htmlFor='newEmail'>Email:</label>
        <input
          type='email'
          name='newEmail'
          id='newEmail'
          autoComplete='email'
          placeholder='Email'
          required={true}
        />
        <label htmlFor='newUsername'>Username:</label>
        <input
          type='username'
          name='newUsername'
          id='newUsername'
          autoComplete='username'
          placeholder='Username'
          required={true}
        />
        <label htmlFor='newPassword'>Create Password:</label>
        <input
          type='password'
          name='newPassword'
          id='newPassword'
          autoComplete='new-password'
          placeholder='Create Password'
          required={true}
        />
        <label htmlFor='confirmPassword'>Confirm Password:</label>
        <input
          type='password'
          name='confirmPassword'
          id='confirmPassword'
          autoComplete='new-password'
          placeholder='Confirm Password'
          required={true}
        />
        {errorText && <div className='ErrorText'>{errorText}</div>}
        <button type='submit'>Signup</button>
      </form>
    </>
  );
};

export default RegisterForm;
