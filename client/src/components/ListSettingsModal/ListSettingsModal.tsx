import './css/styles.css';
import Modal from 'react-modal';
import { List, SharedUser } from '../../types';
import { useState } from 'react';
import { useAppDispatch } from '../../redux/Hooks';
import { editList } from '../../redux/List/ListSlice';
import { findUser } from '../../redux/User/UserApi';

interface Props {
  isOpen: boolean;
  handleCloseModal: Function;
  lists: Array<List>;
  activeList: number;
}

const ListSettingsModal: React.FC<Props> = ({
  isOpen,
  handleCloseModal,
  lists,
  activeList,
}) => {
  const dispatch = useAppDispatch();
  const [newListName, setNewListName] = useState<string>(
    lists[activeList].name
  );
  const [newSharedUsers, setNewSharedUsers] = useState<Array<SharedUser>>([]);
  const [newSharedUserName, setNewSharedUserName] = useState<string>('');

  const handleAddNewSharedUser = async () => {
    if (
      [...lists[activeList].sharedUsers, ...newSharedUsers].filter(
        user => user.username === newSharedUserName
      ).length === 0
    ) {
      const user = await findUser(newSharedUserName);
      if (user != null) {
        setNewSharedUsers(prev => {
          return [...prev, { ...user, canEdit: false }];
        });
      } else {
        alert('User not found');
      }
    }
  };

  const handleUpdateList = async () => {
    const res = await dispatch(
      editList({
        listID: lists[activeList]._id,
        updatedValues: {
          name: newListName,
          sharedUsers: [...lists[activeList].sharedUsers, ...newSharedUsers],
        },
      })
    );

    if (res.meta.requestStatus === 'fulfilled') {
      handleCloseModal();
    }
  };

  return (
    <Modal
      className='modal add-list-modal'
      overlayClassName='modal-overlay'
      isOpen={isOpen}
      onRequestClose={() => handleCloseModal()}
      shouldCloseOnOverlayClick={true}
      contentLabel='New List Modal'
    >
      <div className='modal-close' onClick={() => handleCloseModal()} />
      <div className='modal-title'>List Settings</div>
      <div className='faded-seperator' />
      <div className='list-details'>
        <div className='list-name'>
          <span>Name: </span>
          <input
            type='text'
            placeholder='List Name'
            maxLength={15}
            value={newListName}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setNewListName(e.currentTarget.value)
            }
          />
        </div>
        <div className='shared-users'>
          <h3>Shared Users</h3>
          {lists[activeList].sharedUsers.map(user => (
            <p key={user.user_id}>{user.username}</p>
          ))}
          {newSharedUsers.map(user => (
            <p key={user.user_id}>{user.username}</p>
          ))}
          <input
            type='text'
            placeholder='Username'
            value={newSharedUserName}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setNewSharedUserName(e.currentTarget.value);
            }}
          />
          <button onClick={handleAddNewSharedUser}>Add user</button>
        </div>
        <button onClick={handleUpdateList}>Save</button>
      </div>
    </Modal>
  );
};

export default ListSettingsModal;
