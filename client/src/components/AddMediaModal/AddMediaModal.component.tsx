import './styles.css';
import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import Modal from 'react-modal';
import { Media, List } from '../../types';
import { searchForTitle, searchByTitle, searchById } from './SearchMediaAPI';
import { addMediaToList } from '../../redux/lists';

interface Props {
  isOpen: boolean;
  handleCloseModal: Function;
  lists: Array<List>;
  activeList: number;
}

const AddMediaModal: React.FC<Props> = ({
  isOpen,
  handleCloseModal,
  lists,
  activeList,
}) => {
  const [mediaInput, setMediaInput] = useState({
    title: '',
    timestamp: '',
    whereToWatch: '',
    list: '',
    notes: '',
  });
  const [searchResult, setSearchResult] = useState<any>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const dispatch = useAppDispatch();

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
      setSelectedMedia(null);
    }
  };

  const handleTitleSearch = useCallback(async () => {
    try {
      // Looking for title...
      let res = await searchForTitle(mediaInput.title);
      if (res.Response === 'True') {
        // Found multiple titles
        setSearchResult(res.Search);
      } else {
        res = await searchByTitle(mediaInput.title);
        if (res.Response === 'True') {
          // Found one title
          setSearchResult([res]);
        } else {
          // Found no titles
          setSearchResult([]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [mediaInput.title]);

  const handleSelectMedia = async (media: any) => {
    const res = await searchById(media.imdbID);
    setSelectedMedia(res);
  };

  const handleAddMedia = () => {
    let newMediaObj;
    if (selectedMedia) {
      newMediaObj = {
        imdbID: selectedMedia.imdbID,
        Title: selectedMedia.Title,
        Year: selectedMedia.Year,
        Type: selectedMedia.Type,
        Plot: selectedMedia.Plot,
        Poster: selectedMedia.Poster,
      };
    } else {
      newMediaObj = {
        imdbID: '',
        Title: mediaInput.title,
        Year: '',
        Type: 'movie',
        Plot: '',
        Poster:
          'http://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png',
      };
    }
    newMediaObj = {
      ...newMediaObj,
      //  Timestamp: mediaInput.timestamp,
      //  WhereToWatch: mediaInput.whereToWatch,
      //  Notes: mediaInput.notes,
    };
    dispatch(addMediaToList({ listIdx: 0, media: newMediaObj }));
    handleCloseModal();
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
                <select placeholder='List' defaultValue={'DEFAULT'}>
                  {lists.map((list: List, idx: number) => {
                    return (
                      <option
                        value={idx === activeList ? 'DEFAULT' : ''}
                        key={idx}
                      >
                        {list.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            {/* Title and description */}
            {selectedMedia && (
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
            selectedMedia
              ? selectedMedia.Poster
              : 'http://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png'
          }
          alt='Movie Poster'
        />
      </div>
      <div
        className='modal-add-media-button'
        onClick={handleAddMedia} // Temporary onClick function
      >
        Add Movie/Series
      </div>
    </Modal>
  );
};

export default AddMediaModal;
