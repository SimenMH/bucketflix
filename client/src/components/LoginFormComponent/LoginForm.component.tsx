import { useState } from 'react';
import { useAppDispatch } from '../../redux/Hooks';
import { userLogin } from '../../redux/User/UserSlice';
import { History } from 'history';

interface Props {
  history: History;
}

const LoginForm: React.FC<Props> = ({ history }) => {
  const dispatch = useAppDispatch();
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
      setErrorText('Incorrect password or email');
    } else {
      history.push('/');
    }
  };

  return (
    <form className='login-form' onSubmit={handleLogin}>
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
      {errorText && <div className='error-text'>{errorText}</div>}
      <button type='submit'>Login</button>
    </form>
  );
};

export default LoginForm;
