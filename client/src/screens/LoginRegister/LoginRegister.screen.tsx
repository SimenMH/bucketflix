import './css/styles.css';
import { useState, useEffect } from 'react';
import { History } from 'history';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { userLogin } from '../../redux/User/UserSlice';

interface Props {
  history: History;
}

const LoginRegister: React.FC<Props> = ({ history }) => {
  const dispatch = useAppDispatch();
  const { status, loggedIn } = useAppSelector(state => state.user);
  const [register, setRegister] = useState<boolean>(false);
  const [incorrect, setIncorrect] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIncorrect(false);
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const res = await dispatch(
      userLogin({ email: target.email.value, password: target.password.value })
    );
    if (res.type === 'user/userLogin/rejected') {
      setIncorrect(true);
    } else {
      history.push('/');
    }
  };

  useEffect(() => {
    if (loggedIn) {
      history.push('/');
    }
  }, [loggedIn, history]);

  return (
    <div className='login-screen'>
      <h2 className='form-label'>{register ? 'Register' : 'Login'}</h2>

      {register ? (
        <>
          <div>Already have an account?</div>
          <div onClick={() => setRegister(false)}>Click here to login!</div>
        </>
      ) : (
        <>
          <fieldset style={{ border: 'none' }} disabled={status === 'Loading'}>
            <form className='login-form' onSubmit={handleLogin}>
              <label htmlFor='email'>Email:</label>
              <input
                type='email'
                name='email'
                id='email'
                autoComplete='username'
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
              {incorrect && <div>Incorrect password or email</div>}
              <button type='submit'>Login</button>
            </form>
          </fieldset>
          <div>Don't have an account?</div>
          <div onClick={() => setRegister(true)}>Click here to register!</div>
        </>
      )}
    </div>
  );
};

export default LoginRegister;
