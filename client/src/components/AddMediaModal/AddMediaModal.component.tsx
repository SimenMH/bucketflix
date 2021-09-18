import './styles.css';
import Modal from 'react-modal';

const tempSuggestions = [
  { title: 'Sherlock', type: 'TV-Series', year: '2010-2017' },
  { title: 'Sherlock Holmes', type: 'Movie', year: '2009' },
  { title: 'Sherlock Holmes: A Game of Shadows', type: 'Movie', year: '2011' },
  { title: 'Sherlock Jr.', type: 'Movie', year: '1924' },
];

interface Props {
  isOpen: boolean;
  handleCloseModal: Function;
}

const AddMediaModal: React.FC<Props> = ({ isOpen, handleCloseModal }) => {
  return (
    <Modal
      className='modal add-media-modal'
      overlayClassName='modal-overlay'
      isOpen={isOpen}
      onRequestClose={() => handleCloseModal()}
      shouldCloseOnOverlayClick={true}
      contentLabel='Add Media Modal'
    >
      <div className='modal-close' onClick={() => handleCloseModal()} />
      <div className='modal-title'>Add New Movie or Series</div>
      <div className='faded-seperator' />
      {/* Content */}
      <div className='media-modal-content'>
        {/* Left Side Content */}
        <div className='media-modal-left'>
          {/* Top Row */}
          <div className='media-modal-top-left'>
            <div className='input-container'>
              <div className='input-item media-title-input'>
                <input placeholder='Movie / Series Title' />
                <div className='suggestions'>
                  {tempSuggestions.map((media, idx: number) => {
                    return (
                      <div className='suggestion-item' key={idx}>
                        <div className='suggestion-item-name'>
                          {media.title}{' '}
                          <span>
                            ({media.type === 'TV-Series' && media.type + ' '}
                            {media.year})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className='input-item'>
                <input placeholder='Current Timestamp / Episode (Optional)' />
              </div>
              <div className='input-item'>
                <input placeholder='Where to Watch (Optional)' />
              </div>
              <div className='input-item'>
                <select placeholder='List'>
                  <option>Personal</option>
                  <option>Lille Bolle</option>
                  <option>Harrison</option>
                </select>
              </div>
            </div>
            {/* Title and description */}
            <div className='media-modal-media-info'>
              <div className='media-modal-media-title'>
                Sherlock <span className='media-modal-media-year'>(2010)</span>
              </div>
              <div className='media-modal-media-type'>TV-Series</div>
              <div className='faded-seperator' />
              <div className='media-modal-media-description'>
                A modern update finds the famous sleuth and his doctor partner
                solving crime in 21st century London.
              </div>
            </div>
          </div>
          {/* Notes Text Area */}
          <textarea placeholder='Notes (Optional)' />
        </div>
        {/* Right Side Content */}
        <img
          className='media-modal-media-poster'
          src='https://m.media-amazon.com/images/M/MV5BMWY3NTljMjEtYzRiMi00NWM2LTkzNjItZTVmZjE0MTdjMjJhL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTQ4NTc5OTU@._V1_SX300.jpg'
          alt='Sherlock Movie Poster'
        />
      </div>
      <div
        className='modal-add-media-button'
        onClick={() => handleCloseModal()} // Temporary onClick function
      >
        Add Movie/Series
      </div>
    </Modal>
  );
};

export default AddMediaModal;
