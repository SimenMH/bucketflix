import './styles.css';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { userLogin } from '../../redux/user';

interface Props {}

const LoginRegister: React.FC<Props> = () => {
  const [register, setRegister] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.user);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    dispatch(
      userLogin({ email: target.email.value, password: target.password.value })
    );
  };

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
                placeholder='Email'
                required={true}
              />
              <label htmlFor='password'>Password:</label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='Password'
                required={true}
              />
              {status === 'failed' && <div>Incorrect password or email</div>}
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
