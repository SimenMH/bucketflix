import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux/hooks';

import NavBar from './components/NavBar/NavBar.component';
import MyLists from './screens/MyLists/MyLists.screen';
import Modal from 'react-modal';
import { useEffect } from 'react';
import { sessionLogin } from './redux/user';
import LoginRegister from './screens/LoginRegister/LoginRegister.screen';

Modal.setAppElement('#root');

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loggedIn } = useAppSelector(state => state.user);

  useEffect(() => {
    dispatch(sessionLogin());
  }, [dispatch]);

  return (
    <div className='app-container'>
      <NavBar />
      <Router>
        <Switch>
          <Route path='/' exact>
            {loggedIn ? <MyLists /> : <Redirect to='/login' />}
          </Route>
          <Route path='/login' exact component={LoginRegister} />
          <Redirect from='/*' to='/' />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
