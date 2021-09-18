import './styles.css';
import Modal from 'react-modal';

interface Props {}

const AddMediaModal: React.FC<Props> = () => {
  return (
    <Modal
      className='modal add-media-modal'
      overlayClassName='modal-overlay'
      isOpen={true}
      // onRequestClose={() => setListModalIsOpen(false)}
      shouldCloseOnOverlayClick={true}
      contentLabel='Add Media Modal'
    >
      <div
        className='modal-close'
        // onClick={}
      />
      <div className='modal-title'>Add New Movie or Series</div>
      <div className='faded-seperator' />
      {/* Content */}
      <div className='media-modal-content'>
        {/* Left Side Content */}
        <div className='media-modal-left'>
          {/* Top Row */}
          <div className='media-modal-top-left'>
            <div className='input-container'>
              <div>
                <input placeholder='Movie / Series Title' />
              </div>
              <div>
                <input placeholder='Current Timestamp / Episode (Optional)' />
              </div>
              <div>
                <input placeholder='Where to Watch (Optional)' />
              </div>
              <div>
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
    </Modal>
  );
};

export default AddMediaModal;
