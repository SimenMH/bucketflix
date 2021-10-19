import './styles.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { userLogin, userLogout } from '../../redux/user';

interface Props {}

const NavBar: React.FC<Props> = () => {
  const { loggedIn } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    dispatch(userLogin({ email: 'john@example.com', password: '123456' }));
  };

  const handleLogout = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    dispatch(userLogout());
  };

  return (
    <div className='navbar-container'>
      <a href='/' className='navbar-title-container'>
        <div className='navbar-logo' />
        <h1 className='navbar-title'>BucketFlix</h1>
      </a>
      <div className='navbar-links'>
        {loggedIn ? (
          <a href='/logout' onClick={handleLogout}>
            Logout
          </a>
        ) : (
          <a href='/login' onClick={handleLogin}>
            Login / Register
          </a>
        )}
        <a href='/about'>About</a>
      </div>
    </div>
  );
};

export default NavBar;
