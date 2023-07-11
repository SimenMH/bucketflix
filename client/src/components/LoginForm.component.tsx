import { useState } from 'react';
import { useAppDispatch } from '../redux/Hooks';
import { userLogin } from '../redux/User/UserSlice';
import { History } from 'history';

interface Props {
  history: History;
}

const LoginForm: React.FC<Props> = ({ history }) => {
  // Redux
  const dispatch = useAppDispatch();

  // React States
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText(null);

    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const res = await dispatch(
      userLogin({ email: target.email.value, password: target.password.value })
    );

    if (res.meta.requestStatus === 'rejected') {
      if (res.payload && res.payload.message) {
        const message = res.payload.message;

        if (message.includes('verify your email')) {
          history.push('/verify-email/send');
        }
      }
      setErrorText('Incorrect password or email');
    } else {
      history.push('/');
    }
  };

  return (
    <form className='LoginRegister__Form' onSubmit={handleLogin}>
      <label htmlFor='email'>Email:</label>
      <input
        type='email'
        name='email'
        id='email'
        autoComplete='email'
        placeholder='Email'
        required={true}
      />
      <label htmlFor='password'>Password:</label>
      <input
        type='password'
        name='password'
        id='password'
        autoComplete='current-password'
        placeholder='Password'
        required={true}
      />
      {errorText && <div className='ErrorText'>{errorText}</div>}
      <button type='submit'>Login</button>
    </form>
  );
};

export default LoginForm;
