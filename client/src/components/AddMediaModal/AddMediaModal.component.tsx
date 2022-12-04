import './css/styles.css';
import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '../../redux/Hooks';
import Modal from 'react-modal';
import { Media, List } from '../../types';
import {
  searchForTitle,
  searchByTitle,
  searchById,
} from '../../api/SearchMediaAPI';
import { addMediaToList } from '../../redux/List/ListSlice';

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
    type: 'movie',
    timestamp: '',
    whereToWatch: '',
    list: lists[activeList].name,
    notes: '',
  });
  const [searchResult, setSearchResult] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const dispatch = useAppDispatch();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const inputName = e.currentTarget.name;
    const value = e.currentTarget.value;

    setMediaInput(prevState => {
      return {
        ...prevState,
        [inputName]: value,
      };
    });
    if (inputName === 'title') {
      if (!value) {
        setSearchResult([]);
      }
      if (selectedMedia) {
        setSelectedMedia(null);
      }
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

  const handleSelectMedia = async (media: Media) => {
    try {
      const res = await searchById(media.imdbID);
      setSelectedMedia(res);
    } catch (err) {
      console.error(err);
    }
  };

  const checkForDuplicate = (listIdx: number, newMedia: Media) => {
    let mediaList: Array<Media>;
    if (mediaInput.type === 'movie') mediaList = lists[listIdx].movies;
    else mediaList = lists[listIdx].series;

    for (let i = 0; i < mediaList.length; i++) {
      if (
        mediaList[i].Title === newMedia.Title &&
        mediaList[i].imdbID === newMedia.imdbID
      ) {
        return true;
      }
    }
    return false;
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
        Type: mediaInput.type,
        Plot: '',
        Poster:
          'http://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png',
      };
    }
    newMediaObj = {
      ...newMediaObj,
      Timestamp: mediaInput.timestamp,
      WhereToWatch: mediaInput.whereToWatch,
      Notes: mediaInput.notes,
    };

    const listIdx = lists.findIndex(list => list.name === mediaInput.list);
    if (checkForDuplicate(listIdx, newMediaObj)) {
      // TODO: Improve this alert
      alert('Movie/Series already exists in this list.');
    } else {
      const listID = lists[listIdx]._id;
      dispatch(addMediaToList({ listID, media: newMediaObj }));
      handleCloseModal();
    }
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
      onAfterOpen={() =>
        setMediaInput(prevState => {
          return {
            ...prevState,
            list: lists[activeList].name,
          };
        })
      }
      onRequestClose={() => handleCloseModal()}
      shouldCloseOnOverlayClick={true}
      contentLabel='Add Media Modal'
    >
      <div className='modal-close' onClick={() => handleCloseModal()} />
      <div className='modal-title'>Add New Movie or Series</div>
      <div className='faded-seperator' />
      {/* Content */}
      <div className='media-modal-content media-input-container'>
        {/* Left Side Content */}
        <div className='media-modal-left'>
          {/* Top Row */}
          <div className='media-modal-top-left'>
            <div className='upper-input-container'>
              <div className='input-item media-title-input'>
                <input
                  type='text'
                  name='title'
                  placeholder='Movie / Series Title'
                  onChange={handleInputChange}
                  value={mediaInput.title}
                />
                <div className='suggestions'>
                  {searchResult.map((media, idx) => {
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
                              type: media.Type,
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
                <select
                  name='type'
                  onChange={handleInputChange}
                  disabled={selectedMedia != null}
                  value={mediaInput.type}
                >
                  <option value='movie'>Movie</option>
                  <option value='series'>TV-Series</option>
                </select>
              </div>
              <div className='input-item'>
                <input
                  type='text'
                  name='timestamp'
                  onChange={handleInputChange}
                  placeholder='Current Timestamp / Episode (Optional)'
                />
              </div>
              <div className='input-item'>
                <input
                  type='text'
                  name='whereToWatch'
                  onChange={handleInputChange}
                  placeholder='Where to Watch (Optional)'
                />
              </div>
              <div className='input-item'>
                <select
                  name='list'
                  value={mediaInput.list}
                  onChange={handleInputChange}
                >
                  {lists.map((list, idx) => {
                    return (
                      <option value={list.name} key={idx}>
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
          <textarea
            maxLength={350}
            name='notes'
            onChange={handleInputChange}
            placeholder='Notes (Optional)'
          />
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
      <div className='modal-add-media-button' onClick={handleAddMedia}>
        Add Movie/Series
      </div>
    </Modal>
  );
};

export default AddMediaModal;
