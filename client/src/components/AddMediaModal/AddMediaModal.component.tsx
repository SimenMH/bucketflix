import './styles.css';
import { useEffect, useState, useCallback } from 'react';
import Modal from 'react-modal';

import { searchForTitle, searchById } from './SearchMediaAPI';

interface Props {
  isOpen: boolean;
  handleCloseModal: Function;
}

const AddMediaModal: React.FC<Props> = ({ isOpen, handleCloseModal }) => {
  const [mediaInput, setMediaInput] = useState({
    title: '',
    timestamp: '',
    whereToWatch: '',
    list: '',
    notes: '',
  });
  const [searchResult, setSearchResult] = useState<any>([]);
  const [selectedMedia, setSelectedMedia] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.currentTarget.value;

    setMediaInput(prevState => {
      return {
        ...prevState,
        title: value,
      };
    });
    if (!value) {
      setSearchResult([]);
    }
    if (selectedMedia) {
      setSelectedMedia({});
    }
  };

  const handleTitleSearch = useCallback(async () => {
    const res = await searchForTitle(mediaInput.title);
    if (res.Search) {
      setSearchResult(res.Search);
    } else {
      setSearchResult([]);
    }
  }, [mediaInput.title]);

  const handleSelectMedia = async (media: any) => {
    const res = await searchById(media.imdbID);
    setSelectedMedia(res);
  };

  useEffect(() => {
    let delayTitleSearch: NodeJS.Timeout | null = null;
    if (mediaInput.title) {
      delayTitleSearch = setTimeout(() => {
        handleTitleSearch();
      }, 1000);
    }

    return () => {
      if (delayTitleSearch) {
        clearTimeout(delayTitleSearch);
      }
    };
  }, [mediaInput.title, handleTitleSearch]);

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
                <input
                  placeholder='Movie / Series Title'
                  onChange={handleInputChange}
                  value={mediaInput.title}
                />
                <div className='suggestions'>
                  {searchResult.map((media: any, idx: number) => {
                    return (
                      <div
                        className='suggestion-item'
                        key={idx}
                        onClick={() => {
                          handleSelectMedia(media);
                          setMediaInput(prevState => {
                            return {
                              ...prevState,
                              title: media.Title,
                            };
                          });
                          setSearchResult([]);
                        }}
                      >
                        <div className='suggestion-item-name'>
                          {media.Title}{' '}
                          <span>
                            ({media.Type === 'series' && 'TV-Series '}
                            {media.Year})
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
            {selectedMedia.Title && (
              <div className='media-modal-media-info'>
                <div className='media-modal-media-title'>
                  {selectedMedia.Title}{' '}
                  <span className='media-modal-media-year'>
                    ({selectedMedia.Year})
                  </span>
                </div>
                <div className='media-modal-media-type'>
                  {selectedMedia.Type === 'series' ? 'TV-Series' : 'Movie'}
                </div>
                <div className='faded-seperator' />
                <div className='media-modal-media-description'>
                  {selectedMedia.Plot}
                </div>
              </div>
            )}
          </div>
          {/* Notes Text Area */}
          <textarea placeholder='Notes (Optional)' />
        </div>
        {/* Right Side Content */}
        <img
          className='media-modal-media-poster'
          src={
            selectedMedia.Poster
              ? selectedMedia.Poster
              : 'http://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png'
          }
          alt='Movie Poster'
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
