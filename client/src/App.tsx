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
    <div className='AppContainer'>
      <NavBar />
      {!loading && (
        <Router>
          <Switch>
            <Route path='/' exact>
              {loggedIn ? <MyLists /> : <Redirect to='/login' />}
            </Route>
            <Route path='/login' exact component={LoginRegister} />
            <Redirect from='/*' to='/' />
          </Switch>
        </Router>
      )}
    </div>
  );
};

export default App;
