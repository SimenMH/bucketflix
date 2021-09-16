import './App.css';

import NavBar from './components/NavBar/NavBar.component';
import MyLists from './screens/MyLists/MyLists.screen';

const App: React.FC = () => {
  return (
    <div className='app'>
      <NavBar />
      <MyLists />
    </div>
  );
};

export default App;
