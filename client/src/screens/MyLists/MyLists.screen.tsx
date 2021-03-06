import './styles.css';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getLists } from '../../redux/lists';
import { Media } from '../../types';

import MyListsSidebar from '../../components/MyListsSidebar/MyListsSidebar.component';
import AddMediaModal from '../../components/AddMediaModal/AddMediaModal.component';
import MediaDetailsModal from '../../components/MediaDetailsModal/MediaDetailsModal.component';

interface Props {}

const MyLists: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { activeList, lists } = useAppSelector(state => state.lists);
  const { loggedIn } = useAppSelector(state => state.user);
  const [filter, setFilter] = useState('all');
  const [addMediaModalVisible, setAddMediaModalVisible] =
    useState<boolean>(false);
  const [mediaDetailsModalVisible, setMediaDetailsModalVisible] =
    useState<boolean>(false);
  const [mediaToDisplay, setMediaToDisplay] = useState<Media | null>(null);

  const handleShowMediaDetails = (media: Media) => {
    setMediaToDisplay(media);
    setMediaDetailsModalVisible(true);
  };

  const handleCloseMediaDetails = () => {
    setMediaToDisplay(null);
    setMediaDetailsModalVisible(false);
  };

  const renderMedia = (mediaArray: Array<Media>): JSX.Element[] => {
    return mediaArray.map((media, idx) => {
      return (
        <div
          className='media-list-item'
          key={idx}
          onClick={() => handleShowMediaDetails(media)}
        >
          <img src={media.Poster} alt='movie-poster' />
          <h3>{media.Title}</h3>
        </div>
      );
    });
  };

  const handleAddMediaClose = () => {
    setAddMediaModalVisible(false);
  };

  useEffect(() => {
    if (loggedIn) {
      dispatch(getLists());
    }
  }, [loggedIn, dispatch]);

  return (
    <div className='mylists-screen'>
      <MyListsSidebar lists={lists} activeList={activeList} />
      {lists[activeList] && (
        <div className='mylists-content'>
          <AddMediaModal
            isOpen={addMediaModalVisible}
            handleCloseModal={handleAddMediaClose}
            lists={lists}
            activeList={activeList}
          />
          {mediaToDisplay && (
            <MediaDetailsModal
              isOpen={mediaDetailsModalVisible}
              handleCloseModal={handleCloseMediaDetails}
              mediaToDisplay={mediaToDisplay}
            />
          )}
          <div className='mylists-option-buttons'>
            <div className='mylists-options-left'>
              <div
                className={`mylists-filter-button ${
                  filter === 'all' ? 'mylists-active-filter-button' : ''
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </div>
              <div
                className={`mylists-filter-button ${
                  filter === 'movies' ? 'mylists-active-filter-button' : ''
                }`}
                onClick={() => setFilter('movies')}
              >
                Movies
              </div>
              <div
                className={`mylists-filter-button ${
                  filter === 'series' ? 'mylists-active-filter-button' : ''
                }`}
                onClick={() => setFilter('series')}
              >
                Series
              </div>
            </div>
            <div className='mylists-options-right'>
              <div
                className='mylists-add-new-button'
                onClick={() => setAddMediaModalVisible(true)}
              >
                <svg
                  className='add-new-plus'
                  width='448'
                  height='448'
                  viewBox='0 0 448 448'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0' />
                </svg>
                <p>Add Movie or Series</p>
              </div>
            </div>
          </div>
          <div className='media-list-container'>
            {/* Movies */}
            {lists[activeList].movies.length > 0 &&
              (filter === 'movies' || filter === 'all') && (
                <div>
                  <div className='media-category'>
                    <h2>Movies</h2>
                    <div className='faded-seperator' />
                  </div>
                  <div className='media-list-items-container'>
                    {renderMedia(lists[activeList].movies)}
                  </div>
                </div>
              )}
            {/*  */}
            {/* TV-Series */}
            {lists[activeList].series.length > 0 &&
              (filter === 'series' || filter === 'all') && (
                <div>
                  <div className='media-category'>
                    <h2>TV-Series</h2>
                    <div className='faded-seperator' />
                  </div>
                  <div className='media-list-items-container'>
                    {renderMedia(lists[activeList].series)}
                  </div>
                </div>
              )}
            {/*  */}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLists;
