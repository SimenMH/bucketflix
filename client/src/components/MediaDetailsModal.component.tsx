import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Media } from '../types';
import { useAppSelector, useAppDispatch } from '../redux/Hooks';
import { editMediaInList, deleteMediaFromList } from '../redux/List/ListSlice';

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
  // Redux
  const dispatch = useAppDispatch();
  const { selectedList } = useAppSelector(state => state.lists);

  // React States
  const [isEditing, setIsEditing] = useState(false);
  const [mediaEditInput, setMediaEditInput] = useState({
    timestamp: mediaToDisplay.Timestamp,
    whereToWatch: mediaToDisplay.WhereToWatch,
    notes: mediaToDisplay.Notes,
  });

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
    if (!selectedList) return;
    const listID = selectedList._id;
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
    if (!selectedList) return;
    const listID = selectedList._id;
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
      className='Modal MediaDetails__Modal'
      overlayClassName='Modal__Overlay'
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => handleCloseModal()}
      contentLabel='Media Details Modal'
    >
      <div className='Modal__Close' onClick={() => handleCloseModal()} />
      <div className='Modal__Title'>
        {mediaToDisplay.Title}{' '}
        {mediaToDisplay.Year && (
          <span>
            ({mediaToDisplay.Type === 'series' ? 'TV-Series ' : ''}
            {mediaToDisplay.Year.split('-')[0]})
          </span>
        )}
      </div>
      <div className='Seperator' />
      <div className='MediaDetails__Content'>
        <img
          className='MediaDetails__Poster'
          src={
            mediaToDisplay.Poster
              ? mediaToDisplay.Poster
              : 'https://printworks-manchester.com/cinema-poster/images/film-poster-placeholder.png'
          }
          alt='Movie Poster'
        />
        {(mediaToDisplay.Plot ||
          mediaToDisplay.Timestamp ||
          mediaToDisplay.WhereToWatch ||
          mediaToDisplay.Notes ||
          isEditing) && (
          <div className='MediaDetails__Details'>
            {mediaToDisplay.Plot && (
              <div>
                <p className='MediaDetails__Description'>
                  {mediaToDisplay.Plot}
                </p>
                <div className='Seperator' />
              </div>
            )}
            {isEditing ? (
              <div>
                <div className='MediaInput__Item'>
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
                    maxLength={150}
                  />
                </div>
                <div className='MediaInput__Item'>
                  <p>Where to watch</p>
                  <input
                    type='text'
                    name='whereToWatch'
                    placeholder='Where to Watch (Optional)'
                    onChange={handleInputChange}
                    value={mediaEditInput.whereToWatch}
                    maxLength={200}
                  />
                </div>
                <p>Notes</p>
                <textarea
                  name='notes'
                  placeholder='Notes (Optional)'
                  onChange={handleInputChange}
                  value={mediaEditInput.notes}
                  maxLength={300}
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
      {selectedList &&
        (!selectedList.hasOwnProperty('canEdit') || selectedList.canEdit) && (
          <div className='MediaDetails__Buttons'>
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
        )}
    </Modal>
  );
};

export default MediaDetailsModal;
