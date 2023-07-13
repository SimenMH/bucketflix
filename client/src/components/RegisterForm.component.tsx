import { useState } from 'react';
import { useAppDispatch } from '../redux/Hooks';
import { userRegister } from '../redux/User/UserSlice';
import { History } from 'history';
import { usernameRegex } from '../util/Regex';

interface Props {
  history: History;
}

const RegisterForm: React.FC<Props> = ({ history }) => {
  // Redux
  const dispatch = useAppDispatch();

  // React States
  const [errorText, setErrorText] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string>('');
  const [newUsername, setNewUSername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText('');

    if (newPassword !== confirmPassword) {
      setErrorText('Passwords must match');
      return;
    }

    if (!newUsername.match(usernameRegex)) {
      setErrorText(
        'Invalid username. Must be at least two characters long and contain at least one letter'
      );
      return;
    }

    const res = await dispatch(
      userRegister({
        email: newEmail,
        username: newUsername,
        password: newPassword,
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
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          required={true}
          maxLength={150}
        />
        <label htmlFor='newUsername'>Username:</label>
        <input
          type='username'
          name='newUsername'
          id='newUsername'
          autoComplete='username'
          placeholder='Username'
          value={newUsername}
          onChange={e => {
            const regex = /^[A-Za-z_\d]{0,}$/;
            if (e.target.value.match(regex)) {
              setNewUSername(e.target.value);
            }
          }}
          required={true}
          maxLength={30}
        />
        <label htmlFor='newPassword'>Create Password:</label>
        <input
          type='password'
          name='newPassword'
          id='newPassword'
          autoComplete='new-password'
          placeholder='Create Password'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required={true}
          maxLength={150}
        />
        <label htmlFor='confirmPassword'>Confirm Password:</label>
        <input
          type='password'
          name='confirmPassword'
          id='confirmPassword'
          autoComplete='new-password'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required={true}
          maxLength={150}
        />
        {errorText && <div className='ErrorText'>{errorText}</div>}
        <button type='submit'>Signup</button>
      </form>
    </>
  );
};

export default RegisterForm;
