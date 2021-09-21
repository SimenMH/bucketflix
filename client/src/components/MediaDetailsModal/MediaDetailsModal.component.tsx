import './styles.css';
import Modal from 'react-modal';
// import { Media } from '../../types';

const mediaToDisplay = {
  imdbID: 'tt2306299',
  Title: 'Vikings',
  Year: '2013-2020',
  Type: 'series',
  Plot: 'Vikings transports us to the brutal and mysterious world of Ragnar Lothbrok, a Viking warrior and farmer who Yearns to explore - and raid - the distant shores across the ocean.',
  Poster:
    'https://m.media-amazon.com/images/M/MV5BODk4ZjU0NDUtYjdlOS00OTljLTgwZTUtYjkyZjk1NzExZGIzXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg',
  Timestamp: 'S2E4',
  WhereToWatch: 'Netflix',
  Notes: 'My notes here',
};

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
      <div className='modal-title'>
        {mediaToDisplay.Title} (
        {mediaToDisplay.Type === 'series' ? 'TV-Series ' : ''}
        {mediaToDisplay.Year.split('-')[0]})
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
            {/* Should be "Current timestamp" if type is movie */}
            {mediaToDisplay.Timestamp && (
              <p>
                Current episode: <span>{mediaToDisplay.Timestamp}</span>
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
