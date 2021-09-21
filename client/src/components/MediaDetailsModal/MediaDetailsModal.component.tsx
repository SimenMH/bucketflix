import './styles.css';
import Modal from 'react-modal';
import { Media } from '../../types';

interface Props {
  isOpen: boolean;
  handleCloseModal: Function;
  mediaToDisplay: Media;
}

const MediaDetailsModal: React.FC<Props> = ({
  isOpen,
  handleCloseModal,
  mediaToDisplay,
}) => {
  return (
    <Modal
      className='modal media-detail-modal'
      overlayClassName='modal-overlay'
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => handleCloseModal()}
      contentLabel='Media Details Modal'
    >
      <div className='modal-close' onClick={() => handleCloseModal()} />
      <div className='modal-title'>
        {mediaToDisplay.Title}{' '}
        {mediaToDisplay.Year && (
          <span>
            ({mediaToDisplay.Type === 'series' ? 'TV-Series ' : ''}
            {mediaToDisplay.Year.split('-')[0]})
          </span>
        )}
      </div>
      <div className='faded-seperator' />
      <div className='media-details-modal-content'>
        <img
          className='media-details-poster'
          src={
            mediaToDisplay.Poster
              ? mediaToDisplay.Poster
              : 'http://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png'
          }
          alt='Movie Poster'
        />
        {(mediaToDisplay.Plot ||
          mediaToDisplay.Timestamp ||
          mediaToDisplay.WhereToWatch ||
          mediaToDisplay.Notes) && (
          <div className='media-details'>
            {mediaToDisplay.Plot && (
              <div>
                <p className='media-details-description'>
                  {mediaToDisplay.Plot}
                </p>
                <div className='faded-seperator' />
              </div>
            )}
            {mediaToDisplay.Timestamp && (
              <p>
                Current{' '}
                {mediaToDisplay.Type === 'movie' ? 'timestamp' : 'episode'}:{' '}
                <span>{mediaToDisplay.Timestamp}</span>
              </p>
            )}
            {mediaToDisplay.WhereToWatch && (
              <p>
                Where to watch: <span>{mediaToDisplay.WhereToWatch}</span>
              </p>
            )}
            {mediaToDisplay.Notes && (
              <p>
                Notes: <span>{mediaToDisplay.Notes}</span>
              </p>
            )}
          </div>
        )}
      </div>
      <div className='media-details-button-container'>
        <div className='media-details-button'>Remove</div>
        <div className='media-details-button'>Edit</div>
      </div>
    </Modal>
  );
};

export default MediaDetailsModal;
