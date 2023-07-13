import { useState } from 'react';
import Modal from 'react-modal';
import { usernameRegex } from '../util/Regex';

import { useAppSelector, useAppDispatch } from '../redux/Hooks';
import { deleteUser, updateUser } from '../redux/User/UserSlice';

const Account = () => {
  // Redux
  const dispatch = useAppDispatch();
  const { username, email } = useAppSelector(state => state.user);

  // React States
  const [newUsername, setNewUSername] = useState<string>(username);
  const [newEmail, setNewEmail] = useState<string>(email);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState<boolean>(false);
  const [confirmDeletePassword, setConfirmDeletePassword] =
    useState<string>('');
  const [confirmDeleteErrorText, setConfirmDeleteErrorText] =
    useState<string>('');
  const [errorText, setErrorText] = useState<string>();
  const [statusText, setStatusText] = useState<string>();

  const handleUpdatePassword = async () => {
    if (newPassword === confirmPassword) {
      const success = await handleUpdateUser({
        newPassword: { currentPassword, newPassword },
      });
      if (success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setStatusText('Password successfully updated');
      }
    } else {
      setErrorText('Passwords must match');
    }
  };

  const handleUpdateUser = async (updatedValues: {
    newEmail?: string;
    newUsername?: string;
    newPassword?: { currentPassword: string; newPassword: string };
  }) => {
    setErrorText('');
    setStatusText('');
    try {
      const res = await dispatch(updateUser(updatedValues));

      if (res.meta.requestStatus === 'rejected') {
        if (res.payload && res.payload.message) {
          setErrorText(res.payload.message);
        } else {
          setErrorText('Unknown error occured, please try again later.');
        }
        return false;
      }
      return true;
    } catch (err) {
      setErrorText('An unknown error occured, please try again later');
      return false;
    }
  };

  const handleDeleteUser = async () => {
    setConfirmDeleteErrorText('');
    try {
      const res = await dispatch(deleteUser(confirmDeletePassword));

      if (res.meta.requestStatus === 'rejected') {
        if (res.payload && res.payload.message) {
          setConfirmDeleteErrorText(res.payload.message);
        } else {
          setConfirmDeleteErrorText(
            'Unknown error occured, please try again later.'
          );
        }
        return false;
      }
      return true;
    } catch (err) {
      setConfirmDeleteErrorText(
        'An unknown error occured, please try again later'
      );
      return false;
    }
  };

  return (
    <div className='AccountSettings'>
      <h1>Account Settings</h1>
      <div className='AccountSettings__Section'>
        <div>Change Username</div>
        <input
          type='username'
          name='newUsername'
          id='newUsername'
          placeholder='New Username'
          value={newUsername}
          onChange={e => {
            const regex = /^[A-Za-z_\d]{0,}$/;
            if (e.target.value.match(regex)) {
              setNewUSername(e.target.value);
            }
          }}
          maxLength={30}
        />
        <button
          disabled={
            newUsername === username ||
            newUsername.match(usernameRegex) === null ||
            newUsername.match(usernameRegex)?.length === 0
          }
          onClick={() => handleUpdateUser({ newUsername })}
        >
          Save
        </button>
      </div>
      <div className='AccountSettings__Section'>
        <div>Change Email</div>
        <input
          type='email'
          name='newEmail'
          id='newEmail'
          placeholder='New Email'
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          maxLength={150}
        />
        <button
          disabled={newEmail === email || newEmail.length <= 0}
          onClick={() => handleUpdateUser({ newEmail })}
        >
          Save
        </button>
      </div>
      <div className='AccountSettings__ChangePassword'>
        <div>Change Password</div>
        <input
          placeholder='Current Password'
          type='password'
          name='currentPassword'
          id='currentPassword'
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          maxLength={150}
        />
        <input
          placeholder='New Password'
          type='password'
          name='newPassword'
          id='newPassword'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          maxLength={150}
        />
        <input
          placeholder='Confirm Password'
          type='password'
          name='confirmPassword'
          id='confirmPassword'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          maxLength={150}
        />
        <button
          disabled={!currentPassword || !newPassword || !confirmPassword}
          onClick={handleUpdatePassword}
        >
          Save
        </button>
      </div>
      {errorText && <div className='ErrorText'>{errorText}</div>}
      {statusText && <div>{statusText}</div>}
      <button
        className='PrimaryButton--red AccountSettings__DeleteAccount'
        onClick={() => setConfirmDeleteModalVisible(true)}
      >
        Delete Account
      </button>

      <Modal
        className='Modal ConfirmModal'
        overlayClassName='Modal__Overlay'
        isOpen={confirmDeleteModalVisible}
        onRequestClose={() => setConfirmDeleteModalVisible(false)}
        shouldCloseOnOverlayClick={true}
        contentLabel='New List Modal'
      >
        <div className='ConfirmModal__Text'>
          Are you sure you want to close your account? This will permanently
          delete all your associated account info and lists
        </div>
        <input
          placeholder='Current Password'
          type='password'
          name='confirmDeletePassword'
          id='confirmDeletePassword'
          value={confirmDeletePassword}
          onChange={e => setConfirmDeletePassword(e.target.value)}
          maxLength={150}
        />
        {confirmDeleteErrorText && (
          <div className='ErrorText'>{confirmDeleteErrorText}</div>
        )}
        <div className='ConfirmModal__Buttons'>
          <button
            className='PrimaryButton--red'
            disabled={!confirmDeletePassword}
            onClick={() => handleDeleteUser()}
          >
            Confirm
          </button>
          <button onClick={() => setConfirmDeleteModalVisible(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Account;
