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
      <div>
        {/* Left Side Content */}
        <div>
          {/* Top Row */}
          <div>
            <div>
              <input />
              <input />
              <input />
              <input />
            </div>
            {/* Title and description */}
            <div>
              <div>Title</div>
              <div>Type</div>
              <div className='faded-seperator' />
              <div>Description</div>
            </div>
          </div>
          {/* Notes Text Area */}
          <textarea />
        </div>
        {/* Right Side Content */}
        <div>Poster</div>
      </div>
    </Modal>
  );
};

export default AddMediaModal;
