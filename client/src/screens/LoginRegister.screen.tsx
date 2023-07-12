import { useState, useEffect } from 'react';
import { useAppSelector } from '../redux/Hooks';
import { History } from 'history';

import RegisterForm from '../components/RegisterForm.component';
import LoginForm from '../components/LoginForm.component';

interface Props {
  history: History;
}

const LoginRegister: React.FC<Props> = ({ history }) => {
  // Redux
  const { status, loggedIn } = useAppSelector(state => state.user);

  // React States
  const [register, setRegister] = useState<boolean>(false);

  useEffect(() => {
    if (loggedIn) {
      history.push('/');
    }
  }, [loggedIn, history]);

  return (
    <div className='LoginRegister'>
      <div className='LoginRegister__Label'>
        {register ? 'Register' : 'Login'}
      </div>

      <fieldset style={{ border: 'none' }} disabled={status === 'Loading'}>
        {register ? (
          <RegisterForm history={history} />
        ) : (
          <LoginForm history={history} />
        )}
      </fieldset>
      {register ? (
        <>
          <div>Already have an account?</div>
          <div className='LinkText' onClick={() => setRegister(false)}>
            Click here to login!
          </div>
        </>
      ) : (
        <>
          <div>Don't have an account?</div>
          <div className='LinkText' onClick={() => setRegister(true)}>
            Click here to signup!
          </div>
          <div
            className='LoginRegister__ForgotPassword'
            onClick={() => history.push('/reset-password')}
          >
            Forgotten password?
          </div>
        </>
      )}
    </div>
  );
};

export default LoginRegister;
