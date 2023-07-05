import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/Hooks';
import { getLists } from '../redux/List/ListSlice';
import { Media } from '../types';

import MyListsSidebar from '../components/MyListsSidebar.component';
import AddMediaModal from '../components/AddMediaModal.component';
import MediaDetailsModal from '../components/MediaDetailsModal.component';
import ListSettingsModal from '../components/ListSettingsModal';

interface Props {}

const MyLists: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { activeList, lists } = useAppSelector(state => state.lists);
  const { loggedIn } = useAppSelector(state => state.user);
  const [filter, setFilter] = useState('all');
  const [addMediaModalVisible, setAddMediaModalVisible] =
    useState<boolean>(false);
  const [listSettingsModalVisible, seListSettinsModalVisible] =
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
          className='Media__Item'
          key={idx}
          onClick={() => handleShowMediaDetails(media)}
        >
          <img className='Item__Poster' src={media.Poster} alt='movie-poster' />
          <h3 className='Item__Title'>{media.Title}</h3>
        </div>
      );
    });
  };

  const handleAddMediaClose = () => {
    setAddMediaModalVisible(false);
  };

  const handleListSettingsClose = () => {
    seListSettinsModalVisible(false);
  };

  useEffect(() => {
    if (loggedIn) {
      dispatch(getLists());
    }
  }, [loggedIn, dispatch]);

  return (
    <div className='MyLists'>
      <MyListsSidebar lists={lists} activeList={activeList} />
      {lists[activeList] && (
        <div className='MyLists__Content'>
          <AddMediaModal
            isOpen={addMediaModalVisible}
            handleCloseModal={handleAddMediaClose}
            lists={lists}
            activeList={activeList}
          />
          <ListSettingsModal
            isOpen={listSettingsModalVisible}
            handleCloseModal={handleListSettingsClose}
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
          <div className='MyLists__Options'>
            <div className='MyLists__Options--left'>
              <div
                className={`MyLists__FilterButton ${
                  filter === 'all' ? 'MyLists__FilterButton--active' : ''
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </div>
              <div
                className={`MyLists__FilterButton ${
                  filter === 'movies' ? 'MyLists__FilterButton--active' : ''
                }`}
                onClick={() => setFilter('movies')}
              >
                Movies
              </div>
              <div
                className={`MyLists__FilterButton ${
                  filter === 'series' ? 'MyLists__FilterButton--active' : ''
                }`}
                onClick={() => setFilter('series')}
              >
                Series
              </div>
            </div>
            <div className='MyLists__Options--right'>
              <button onClick={() => setAddMediaModalVisible(true)}>
                + Add Media
              </button>
              <button onClick={() => seListSettinsModalVisible(true)}>
                Settings
              </button>
            </div>
          </div>
          <div className='MyLists__Media'>
            {/* Movies */}
            {lists[activeList].movies.length > 0 &&
              (filter === 'movies' || filter === 'all') && (
                <div>
                  <div className='Media__Category'>
                    <h2 className='Media__Header'>Movies</h2>
                    <div className='Seperator' />
                  </div>
                  <div className='Media__Container'>
                    {renderMedia(lists[activeList].movies)}
                  </div>
                </div>
              )}
            {/*  */}
            {/* TV-Series */}
            {lists[activeList].series.length > 0 &&
              (filter === 'series' || filter === 'all') && (
                <div>
                  <div className='Media__Category'>
                    <h2 className='Media__Header'>TV-Series</h2>
                    <div className='Seperator' />
                  </div>
                  <div className='Media__Container'>
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
