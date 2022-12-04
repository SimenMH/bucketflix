import './css/styles.css';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Media } from '../../types';
import { useAppSelector, useAppDispatch } from '../../redux/Hooks';
import {
  editMediaInList,
  deleteMediaFromList,
} from '../../redux/List/ListSlice';

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
  const [isEditing, setIsEditing] = useState(false);
  const [mediaEditInput, setMediaEditInput] = useState({
    timestamp: mediaToDisplay.Timestamp,
    whereToWatch: mediaToDisplay.WhereToWatch,
    notes: mediaToDisplay.Notes,
  });
  const { activeList, lists } = useAppSelector(state => state.lists);
  const dispatch = useAppDispatch();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const inputName = e.currentTarget.name;
    const value = e.currentTarget.value;

    setMediaEditInput(prevState => {
      return {
        ...prevState,
        [inputName]: value,
      };
    });
  };

  const handleUpdateMedia = async () => {
    const listID = lists[activeList]._id;
    const mediaID = mediaToDisplay._id;
    if (!mediaID) return;
    await dispatch(
      editMediaInList({
        listID,
        mediaID,
        type: mediaToDisplay.Type,
        updatedValues: mediaEditInput,
      })
    );
    handleCloseModal();
  };

  const handleRemoveMedia = () => {
    const listID = lists[activeList]._id;
    const mediaID = mediaToDisplay._id;
    if (!mediaID) return;

    dispatch(deleteMediaFromList({ listID, mediaID }));
    handleCloseModal();
  };

  useEffect(() => {
    setMediaEditInput({
      timestamp: mediaToDisplay.Timestamp,
      whereToWatch: mediaToDisplay.WhereToWatch,
      notes: mediaToDisplay.Notes,
    });
  }, [isEditing, mediaToDisplay]);

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
          mediaToDisplay.Notes ||
          isEditing) && (
          <div className='media-details'>
            {mediaToDisplay.Plot && (
              <div>
                <p className='media-details-description'>
                  {mediaToDisplay.Plot}
                </p>
                <div className='faded-seperator' />
              </div>
            )}
            {isEditing ? (
              <div className='media-input-container'>
                <div className='input-item'>
                  <p>
                    Current{' '}
                    {mediaToDisplay.Type === 'movie' ? 'timestamp' : 'episode'}
                  </p>
                  <input
                    type='text'
                    name='timestamp'
                    placeholder='Current Timestamp / Episode (Optional)'
                    onChange={handleInputChange}
                    value={mediaEditInput.timestamp}
                  />
                </div>
                <div className='input-item'>
                  <p>Where to watch</p>
                  <input
                    type='text'
                    name='whereToWatch'
                    placeholder='Where to Watch (Optional)'
                    onChange={handleInputChange}
                    value={mediaEditInput.whereToWatch}
                  />
                </div>
                <p>Notes</p>
                <textarea
                  maxLength={350}
                  name='notes'
                  placeholder='Notes (Optional)'
                  onChange={handleInputChange}
                  value={mediaEditInput.notes}
                />
              </div>
            ) : (
              <div>
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
        )}
      </div>
      <div className='media-details-button-container'>
        {isEditing ? (
          <>
            <button onClick={handleUpdateMedia}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleRemoveMedia}>Remove</button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default MediaDetailsModal;
