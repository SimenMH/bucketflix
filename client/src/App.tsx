import './App.css';
import { useAppDispatch } from './redux/hooks';

import NavBar from './components/NavBar/NavBar.component';
import MyLists from './screens/MyLists/MyLists.screen';
import Modal from 'react-modal';
import { useEffect } from 'react';
import { sessionLogin } from './redux/user';

Modal.setAppElement('#root');

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(sessionLogin());
  }, [dispatch]);
  return (
    <div className='app-container'>
      <NavBar />
      <MyLists />
    </div>
  );
};

export default App;
