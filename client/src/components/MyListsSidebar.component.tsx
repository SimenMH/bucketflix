import { useState } from 'react';
import { useAppDispatch } from '../redux/Hooks';
import { updateActiveList, addList } from '../redux/List/ListSlice';
import Modal from 'react-modal';
import { List } from '../types';

interface Props {
  lists: Array<List>;
  activeList: number;
}

const MyListsSidebar: React.FC<Props> = ({ lists, activeList }) => {
  const dispatch = useAppDispatch();
  const [listModalIsOpen, setListModalIsOpen] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>('');

  const renderLists = (): JSX.Element[] => {
    return lists.map((list, idx) => {
      return (
        <div
          className={`Sidebar__Item ${
            idx === activeList && 'Sidebar__Item--active'
          }`}
          key={idx}
          onClick={() => dispatch(updateActiveList(idx))}
        >
          <div className='Sidebar__ListName'>
            {/* <svg
              className={`Sidebar__Selector ${
                idx === activeList ? 'Sidebar__Selector--active' : ''
              }`}
              width='15'
              height='15'
              viewBox='0 0 13 13'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M10.5413 5.64324C11.2103 6.02396 11.2164 6.98619 10.5521 7.37525L2.33209 12.19C1.66785 12.579 0.831519 12.1031 0.826699 11.3333L0.767052 1.80725C0.762232 1.03746 1.59254 0.551128 2.2616 0.931846L10.5413 5.64324Z' />
            </svg> */}
            <h3>{list.name}</h3>
          </div>
          {/* <div className='Seperator' /> */}
        </div>
      );
    });
  };

  return (
    <div className='MyLists__Sidebar'>
      <div className='Sidebar__Top'>
        <h2>My Lists</h2>
        <button onClick={() => setListModalIsOpen(true)}>+ New</button>
      </div>
      <div>{renderLists()}</div>
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
          <input
            className='NewList__Input'
            type='text'
            placeholder='List Name'
            maxLength={15}
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
      </Modal>
    </div>
  );
};

export default MyListsSidebar;
