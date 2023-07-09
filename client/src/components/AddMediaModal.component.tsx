import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '../redux/Hooks';
import Modal from 'react-modal';
import { Media, List } from '../types';
import { searchForTitle, searchByTitle, searchById } from '../api/SearchMedia';
import { addMediaToList } from '../redux/List/ListSlice';

interface Props {
  isOpen: boolean;
  handleCloseModal: Function;
  lists: Array<List>;
  sharedLists: Array<List>;
  selectedList: List;
}

const AddMediaModal: React.FC<Props> = ({
  isOpen,
  handleCloseModal,
  lists,
  sharedLists,
  selectedList,
}) => {
  // Redux
  const dispatch = useAppDispatch();

  // React States
  const [mediaInput, setMediaInput] = useState({
    title: '',
    type: 'movie',
    timestamp: '',
    whereToWatch: '',
    list: selectedList._id,
    notes: '',
  });
  const [searchResult, setSearchResult] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [errorText, setErrorText] = useState<string>('');

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

  const handleAddMedia = async () => {
    setErrorText('');
    try {
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
            'https://printworks-manchester.com/cinema-poster/images/film-poster-placeholder.png',
        };
      }
      newMediaObj = {
        ...newMediaObj,
        Timestamp: mediaInput.timestamp,
        WhereToWatch: mediaInput.whereToWatch,
        Notes: mediaInput.notes,
      };

      const res = await dispatch(
        addMediaToList({ listID: mediaInput.list, media: newMediaObj })
      );

      if (res.meta.requestStatus === 'rejected') {
        if (res.payload) {
          setErrorText(res.payload);
        } else {
          setErrorText('Unknown error occured, please try again later.');
        }
      } else {
        handleCloseModal();
      }
    } catch (err: any) {
      setErrorText('Unknown error occured, please try again later.');
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
      className='Modal AddMedia AddMedia__Modal'
      overlayClassName='Modal__Overlay'
      isOpen={isOpen}
      onAfterOpen={() =>
        setMediaInput(prevState => {
          return {
            ...prevState,
            list: selectedList._id,
          };
        })
      }
      onRequestClose={() => handleCloseModal()}
      shouldCloseOnOverlayClick={true}
      contentLabel='Add Media Modal'
    >
      <div className='Modal__Close' onClick={() => handleCloseModal()} />
      <div className='Modal__Title'>Add New Movie or Series</div>
      <div className='Seperator' />
      {/* Content */}
      <div className='AddMedia__Content'>
        {/* Left Side Content */}
        <div>
          {/* Top Row */}
          <div className='AddMedia__Content--TopLeft'>
            <div>
              <div className='MediaInput__Item AddMedia__TitleInput'>
                <input
                  type='text'
                  name='title'
                  placeholder='Movie / Series Title'
                  onChange={handleInputChange}
                  value={mediaInput.title}
                />
                {searchResult.length > 0 && (
                  <div className='Suggestions'>
                    {searchResult.map((media, idx) => {
                      return (
                        <div
                          className='Suggestions__Item'
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
                          <div className='Suggestions__ItemName'>
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
                )}
              </div>
              <div className='MediaInput__Item'>
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
              <div className='MediaInput__Item'>
                <input
                  type='text'
                  name='timestamp'
                  onChange={handleInputChange}
                  placeholder='Current Timestamp / Episode (Optional)'
                />
              </div>
              <div className='MediaInput__Item'>
                <input
                  type='text'
                  name='whereToWatch'
                  onChange={handleInputChange}
                  placeholder='Where to Watch (Optional)'
                />
              </div>
              <div className='MediaInput__Item'>
                <select
                  name='list'
                  value={mediaInput.list}
                  onChange={handleInputChange}
                >
                  {lists.map(list => {
                    return (
                      <option value={list._id} key={list._id}>
                        {list.name}
                      </option>
                    );
                  })}
                  {sharedLists.some(list => list.canEdit) && (
                    <option className='OptionSeperator' disabled>
                      &nbsp;
                    </option>
                  )}
                  {sharedLists.map(list => {
                    if (list.canEdit) {
                      return (
                        <option value={list._id} key={list._id}>
                          {list.name}
                        </option>
                      );
                    }
                    return null;
                  })}
                </select>
              </div>
            </div>
            {/* Title and description */}
            {selectedMedia && (
              <div className='MediaInfo'>
                <div className='MediaInfo__Title'>
                  {selectedMedia.Title}{' '}
                  <span className='MediaInfo__Year'>
                    ({selectedMedia.Year})
                  </span>
                </div>
                <div className='MediaInfo__Type'>
                  {selectedMedia.Type === 'series' ? 'TV-Series' : 'Movie'}
                </div>
                <div className='Seperator' />
                <div className='MediaInfo__Description'>
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
          {errorText && <div className='ErrorText'>{errorText}</div>}
        </div>
        {/* Right Side Content */}
        <img
          className='AddMedia__Poster'
          src={
            selectedMedia
              ? selectedMedia.Poster
              : 'https://printworks-manchester.com/cinema-poster/images/film-poster-placeholder.png'
          }
          alt='Movie Poster'
        />
      </div>
      <button className='AddMedia__Button' onClick={handleAddMedia}>
        Add Movie/Series
      </button>
    </Modal>
  );
};

export default AddMediaModal;
