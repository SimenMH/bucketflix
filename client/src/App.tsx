import './App.css';

import NavBar from './components/NavBar/NavBar.component';
import MyLists from './screens/MyLists/MyLists.screen';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const App: React.FC = () => {
  return (
    <div className='app-container'>
      <NavBar />
      <MyLists />
    </div>
  );
};

export default App;
