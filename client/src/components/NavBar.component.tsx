import { useAppDispatch, useAppSelector } from '../redux/Hooks';
import { userLogout } from '../redux/User/UserSlice';

interface Props {}

const NavBar: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { loggedIn } = useAppSelector(state => state.user);

  const handleLogout = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    dispatch(userLogout());
  };

  return (
    <div className='NavBar'>
      <a href='/' className='NavBar__TitleContainer'>
        {/* <div className='NavBar__Logo' /> */}
        <div className='NavBar__Title'>BucketFlix</div>
      </a>
      <div className='NavBar__Links'>
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
