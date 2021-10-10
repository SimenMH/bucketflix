import './styles.css';
import { tempUserLogin } from '../../api/userAPI';
import { useAppDispatch } from '../../redux/hooks';
import { getLists } from '../../redux/lists';

interface Props {}

const NavBar: React.FC<Props> = () => {
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();

    const res = await tempUserLogin();
    if (res.statusText === 'OK') {
      dispatch(getLists());
    }
  };

  return (
    <div className='navbar-container'>
      <a href='/' className='navbar-title-container'>
        <div className='navbar-logo' />
        <h1 className='navbar-title'>BucketFlix</h1>
      </a>
      <div className='navbar-links'>
        <a href='/login' onClick={handleLogin}>
          Login / Register
        </a>
        <a href='/about'>About</a>
      </div>
    </div>
  );
};

export default NavBar;
