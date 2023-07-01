import './css/styles.css';
import Modal from 'react-modal';
import { List, SharedUser } from '../../types';
import { useState } from 'react';
import { useAppDispatch } from '../../redux/Hooks';
import { editList } from '../../redux/List/ListSlice';
import { generateListInvite } from '../../api/GenerateListInvite';

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
  const [listInviteCode, setListInviteCode] = useState<string | null>(null);

  const handleGenerateInvite = async () => {
    const newInviteCode = await generateListInvite(lists[activeList]._id);
    setListInviteCode(newInviteCode);
  };

  const handleUpdateList = async () => {
    // Only allow updating one thing at the time. Either update the name, or remove a single user from the shared users list. Split the endpoints
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
      // closeModal();
    }
  };

  const closeModal = () => {
    setListInviteCode(null);
    handleCloseModal();
  };

  return (
    <Modal
      className='modal add-list-modal'
      overlayClassName='modal-overlay'
      isOpen={isOpen}
      onRequestClose={() => closeModal()}
      shouldCloseOnOverlayClick={true}
      contentLabel='New List Modal'
    >
      <div className='modal-close' onClick={() => closeModal()} />
      <div className='modal-title'>List Settings</div>
      <div className='faded-seperator' />
      <div className='list-details'>
        <div className='list-name'>
          <input
            type='text'
            placeholder='List Name'
            maxLength={15}
            value={newListName}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setNewListName(e.currentTarget.value)
            }
          />
          <button onClick={handleUpdateList}>Save</button>
        </div>
        {/* Shared Users */}
        <div className='shared-users'>
          <h3>Shared Users</h3>
          {lists[activeList].sharedUsers.map(user => (
            <p key={user.user_id}>{user.username}</p>
          ))}
          {newSharedUsers.map(user => (
            <p key={user.user_id}>{user.username}</p>
          ))}
          <input
            className='list-invite-link'
            type='text'
            placeholder=''
            value={
              listInviteCode
                ? `https://localhost:3000/invite?i=${listInviteCode}`
                : ''
            }
            disabled
            readOnly
          />
          <button onClick={handleGenerateInvite}>Generate link</button>
        </div>
        {/*  */}
      </div>
    </Modal>
  );
};

export default ListSettingsModal;
