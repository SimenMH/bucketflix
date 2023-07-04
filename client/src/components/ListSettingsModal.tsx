import Modal from 'react-modal';
import { List, SharedUser } from '../types';
import { useState } from 'react';
import { useAppDispatch } from '../redux/Hooks';
import {
  editList,
  editSharedUser,
  removeSharedUser,
} from '../redux/List/ListSlice';
import { generateListInvite } from '../api/GenerateListInvite';

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
  const [errorText, setErrorText] = useState<string | null>(null);
  const [newListName, setNewListName] = useState<string>(
    lists[activeList].name
  );
  const [listInviteCode, setListInviteCode] = useState<string | null>(null);

  const handleGenerateInvite = async () => {
    const newInviteCode = await generateListInvite(lists[activeList]._id);
    setListInviteCode(newInviteCode);
  };

  const handleUpdateListName = async () => {
    setErrorText(null);

    const res = await dispatch(
      editList({
        listID: lists[activeList]._id,
        updatedValues: {
          name: newListName,
        },
      })
    );

    if (res.meta.requestStatus === 'rejected') {
      if (res.payload) {
        setErrorText(res.payload);
      } else {
        setErrorText('Unknown error occured, please try again later.');
      }
    }
  };

  const handleUpdateSharedUser = async (
    e: React.ChangeEvent<HTMLInputElement>,
    user: SharedUser
  ) => {
    const res = await dispatch(
      editSharedUser({
        listID: lists[activeList]._id,
        sharedUserID: user.user_id,
        updatedValues: {
          canEdit: e.target.checked,
        },
      })
    );

    if (res.meta.requestStatus === 'rejected') {
      if (res.payload) {
        setErrorText(res.payload);
      } else {
        setErrorText('Unknown error occured, please try again later.');
      }
    }
  };

  const handleRemoveSharedUser = async (user: SharedUser) => {
    const res = await dispatch(
      removeSharedUser({
        listID: lists[activeList]._id,
        sharedUserID: user.user_id,
      })
    );

    if (res.meta.requestStatus === 'rejected') {
      if (res.payload) {
        setErrorText(res.payload);
      } else {
        setErrorText('Unknown error occured, please try again later.');
      }
    }
  };

  const closeModal = () => {
    setListInviteCode(null);
    setNewListName(lists[activeList].name);
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
      <div className='FadedSeperator' />
      <div className='list-details'>
        <div className='error-text'>{errorText}</div>
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
          <button
            onClick={handleUpdateListName}
            disabled={lists[activeList].name === newListName || !newListName}
          >
            Save
          </button>
        </div>
        {/* Shared Users */}
        <div className='shared-users'>
          <h3>
            Shared Users <span>Editor</span>
          </h3>
          {lists[activeList].sharedUsers.map(user => (
            <div className='shared-user' key={user.user_id}>
              <div
                className='modal-close'
                onClick={() => handleRemoveSharedUser(user)}
              />
              <p>{user.username}</p>
              <label className='switch'>
                <input
                  type='checkbox'
                  checked={user.canEdit}
                  onChange={e => handleUpdateSharedUser(e, user)}
                />
                <span className='slider'></span>
              </label>
            </div>
          ))}
          <input
            className='list-invite-link'
            type='text'
            placeholder='Generate a link to invite other users to this list'
            value={
              listInviteCode
                ? `https://${window.location.host}/invite?i=${listInviteCode}`
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
