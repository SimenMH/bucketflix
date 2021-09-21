import './styles.css';
import Modal from 'react-modal';
// import { Media } from '../../types';

interface Props {
  // mediaToDisplay: Media;
}

const MediaDetailsModal: React.FC<Props> = () => {
  return (
    <Modal
      className='modal media-detail-modal'
      overlayClassName='modal-overlay'
      isOpen={true}
      shouldCloseOnOverlayClick={true}
      contentLabel='Media Details Modal'
    >
      <div
        className='modal-close'
        // onClick={() => handleCloseModal()}
      />
      <div className='modal-title'>Title (Type Year)</div>
      <div className='faded-seperator' />
      <div className='media-details-modal-content'>
        <img
          className='media-details-poster'
          src='http://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png'
          alt='Movie Poster'
        />
        <div className='media-details'>
          <p className='media-details-description'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus
            libero quis sapien commodo, sit amet tristique nibh convallis.
          </p>
          <div className='faded-seperator' />
          {/* Should be "Current timestamp" if type is movie */}
          <p>
            Current episode: <span>S2E4</span>
          </p>
          <p>
            Where to watch: <span>Netflix</span>
          </p>
          <p>
            Notes:{' '}
            <span>
              Nam ultricies elementum sem sit amet pulvinar. Praesent rutrum
              tellus id pellentesque porta. Nulla elit mauris, egestas sit amet
              accumsan sed, mattis non eros.
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default MediaDetailsModal;
