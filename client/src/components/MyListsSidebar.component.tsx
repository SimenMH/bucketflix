import { useState } from 'react';
import { useAppDispatch } from '../redux/Hooks';
import { updateSelectedList, addList } from '../redux/List/ListSlice';
import Modal from 'react-modal';
import { List } from '../types';

interface Props {
  lists: Array<List>;
  sharedLists: Array<List>;
  selectedList: List | null;
}

const MyListsSidebar: React.FC<Props> = ({
  lists,
  sharedLists,
  selectedList,
}) => {
  // Redux
  const dispatch = useAppDispatch();

  // React States
  const [listModalIsOpen, setListModalIsOpen] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>('');
  const [expandSidebar, setExpandSidebar] = useState<boolean>(false);

  const renderLists = (list: Array<List>): JSX.Element[] => {
    return list.map((item, idx) => {
      return (
        <div
          className={`Sidebar__Item ${
            selectedList &&
            item._id === selectedList._id &&
            'Sidebar__Item--active'
          }`}
          key={idx}
          onClick={() => dispatch(updateSelectedList(item))}
        >
          <div className='Sidebar__ListName'>
            <h3>{item.name}</h3>
          </div>
        </div>
      );
    });
  };

  return (
    <div
      className={`MyLists__Sidebar ${
        expandSidebar && 'MyLists__Sidebar--active'
      }`}
    >
      <div
        className={`Sidebar__ExpandButton ${
          expandSidebar && 'Sidebar__ExpandButton--active'
        }`}
        onClick={() => setExpandSidebar(state => !state)}
      >
        <div className='ExpandButton__Line' />
        <div className='ExpandButton__Line' />
        <div className='ExpandButton__Line' />
      </div>
      <div className='Sidebar__Top'>
        <h2>My Lists</h2>
        <button onClick={() => setListModalIsOpen(true)}>+ New</button>
      </div>
      <div>{renderLists(lists)}</div>

      {sharedLists.length > 0 && (
        <div className='Sidebar__Top'>
          <h2>Shared Lists</h2>
        </div>
      )}
      <div>{renderLists(sharedLists)}</div>

      <Modal
        className='Modal NewList__Modal'
        overlayClassName='Modal__Overlay'
        isOpen={listModalIsOpen}
        onRequestClose={() => setListModalIsOpen(false)}
        shouldCloseOnOverlayClick={true}
        contentLabel='New List Modal'
      >
        <div
          className='Modal__Close'
          onClick={() => setListModalIsOpen(false)}
        />
        <div className='Modal__Title'>Create New List</div>
        <div className='Seperator' />
        <div className='NewList__Content'>
          <div className='NewList__Heading'>Name your list:</div>

          <div className='NewList__Name'>
            <input
              className='NewList__Input'
              type='text'
              placeholder='List Name'
              maxLength={30}
              value={newListName}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setNewListName(e.currentTarget.value)
              }
            />
            <button
              onClick={() => {
                if (newListName) {
                  dispatch(addList(newListName));
                  setListModalIsOpen(false);
                  setNewListName('');
                }
              }}
            >
              Create List
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyListsSidebar;
