import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/Hooks';
import { userLogout } from '../redux/User/UserSlice';

interface Props {}

const NavBar: React.FC<Props> = () => {
  // Redux
  const dispatch = useAppDispatch();
  const { loggedIn } = useAppSelector(state => state.user);

  // React States
  const [expandDrawer, setExpandDrawer] = useState<boolean>(false);

  const renderLinks = () => {
    return (
      <>
        {loggedIn ? (
          <>
            <a href='/'>Home</a>
            <a href='/account'>Account</a>
            <a href='/logout' onClick={handleLogout}>
              Logout
            </a>
          </>
        ) : (
          <a href='/login'>Login / Register</a>
        )}
        <a href='/about'>About</a>
      </>
    );
  };

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
      <div className='NavBar__Links'>{renderLinks()}</div>

      <div
        className={`NavBar__BurgerButton ${
          expandDrawer && 'NavBar__BurgerButton--active'
        }`}
        onClick={() => setExpandDrawer(state => !state)}
      >
        <div className='BurgerButton__Line' />
        <div className='BurgerButton__Line' />
        <div className='BurgerButton__Line' />
      </div>

      <div
        className={`NavBar__MenuDrawer ${
          expandDrawer && 'NavBar__MenuDrawer--active'
        }`}
      >
        {renderLinks()}
      </div>
    </div>
  );
};

export default NavBar;
