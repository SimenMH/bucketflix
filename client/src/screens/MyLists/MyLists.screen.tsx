import './styles.css';

interface Props {}

const MyLists: React.FC<Props> = () => {
  return (
    <div className='mylists-screen'>
      <div className='mylists-sidebar'></div>
      <div className='mylists-content'></div>
    </div>
  );
};

export default MyLists;
