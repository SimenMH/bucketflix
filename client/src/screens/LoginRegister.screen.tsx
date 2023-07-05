import { useState, useEffect } from 'react';
import { useAppSelector } from '../redux/Hooks';
import { History } from 'history';

import RegisterForm from '../components/RegisterForm.component';
import LoginForm from '../components/LoginForm.component';

interface Props {
  history: History;
}

const LoginRegister: React.FC<Props> = ({ history }) => {
  const { status, loggedIn } = useAppSelector(state => state.user);
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
        </>
      )}
    </div>
  );
};

export default LoginRegister;
