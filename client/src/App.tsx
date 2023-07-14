import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux/Hooks';

import NavBar from './components/NavBar.component';
import MyLists from './screens/MyLists.screen';
import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { sessionLogin } from './redux/User/UserSlice';
import LoginRegister from './screens/LoginRegister.screen';
import Invite from './screens/Invite.screen';
import Account from './screens/Account.screen';
import EmailVerification from './screens/EmailVerification.screen';
import SendEmailVerification from './screens/SendEmailVerification.screen';
import PasswordReset from './screens/PasswordReset.screen';

Modal.setAppElement('#root');

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loggedIn } = useAppSelector(state => state.user);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const attemptSessionLogin = async () => {
      setLoading(true);
      await dispatch(sessionLogin());
      setLoading(false);
    };
    attemptSessionLogin();
  }, [dispatch]);

  return (
    <>
      <NavBar />
      <div className='AppContainer'>
        {!loading && (
          <Router>
            <Switch>
              <Route path='/' exact>
                {loggedIn ? <MyLists /> : <Redirect to='/login' />}
              </Route>
              <Route path='/login' exact component={LoginRegister} />
              <Route path='/invite' exact>
                {loggedIn ? (
                  <Route component={Invite} />
                ) : (
                  <Redirect to='/login' />
                )}
              </Route>
              <Route path='/account' exact>
                {loggedIn ? <Account /> : <Redirect to='/login' />}
              </Route>
              <Route path='/verify-email' exact component={EmailVerification} />
              <Route path='/verify-email/new' exact>
                {loggedIn ? <Redirect to='/' /> : <SendEmailVerification />}
              </Route>
              <Route path='/reset-password' exact>
                {loggedIn ? (
                  <Redirect to='/' />
                ) : (
                  <Route component={PasswordReset} />
                )}
              </Route>

              <Redirect from='/*' to='/' />
            </Switch>
          </Router>
        )}
      </div>
    </>
  );
};

export default App;
