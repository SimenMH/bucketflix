import './styles.css';

const tempLists: Array<string> = ['Personal', 'Lille Bolle', 'Harrison'];

interface Props {}

const MyLists: React.FC<Props> = () => {
  const renderLists = (): JSX.Element[] => {
    return tempLists.map(list => {
      return (
        <div className='mylists-item'>
          <div className='mylists-list-name'>
            <svg
              className='mylists-selector'
              width='15'
              height='15'
              viewBox='0 0 13 13'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M10.5413 5.64324C11.2103 6.02396 11.2164 6.98619 10.5521 7.37525L2.33209 12.19C1.66785 12.579 0.831519 12.1031 0.826699 11.3333L0.767052 1.80725C0.762232 1.03746 1.59254 0.551128 2.2616 0.931846L10.5413 5.64324Z' />
            </svg>
            <h3>{list}</h3>
          </div>
          <div className='faded-seperator' />
        </div>
      );
    });
  };

  return (
    <div className='mylists-screen'>
      <div className='mylists-sidebar'>
        <div className='mylists-title-container'>
          <h2>My Lists</h2>
          <div className='add-list-button'>
            <svg
              className='add-list-plus'
              width='448'
              height='448'
              viewBox='0 0 448 448'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0' />
            </svg>
          </div>
        </div>
        {renderLists()}
      </div>
      <div className='mylists-content'></div>
    </div>
  );
};

export default MyLists;
