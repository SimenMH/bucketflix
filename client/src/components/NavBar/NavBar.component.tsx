import './styles.css';

interface Props {}

const NavBar: React.FC<Props> = () => {
  return (
    <div className='navbar-container'>
      <a href='/' className='navbar-title-container'>
        <div className='navbar-logo' />
        <h1 className='navbar-title'>BucketFlix</h1>
      </a>
      <div className='navbar-links'>
        <a href='/login'>Login / Register</a>
        <a href='/about'>About</a>
      </div>
    </div>
  );
};

export default NavBar;
