import './css/styles.css';
import { useAppDispatch, useAppSelector } from '../../redux/Hooks';
import { userLogin, userLogout } from '../../redux/User/UserSlice';

interface Props {}

const NavBar: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { loggedIn } = useAppSelector(state => state.user);

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
          <a href='/login'>Login / Register</a>
        )}
        <a href='/about'>About</a>
      </div>
    </div>
  );
};

export default NavBar;
