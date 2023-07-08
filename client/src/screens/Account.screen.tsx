import { useState } from 'react';
import { useAppSelector } from '../redux/Hooks';

const Account = () => {
  const { username, email } = useAppSelector(state => state.user);
  const [newUsername, setNewUSername] = useState<string>(username);
  const [newEmail, setNewEmail] = useState<string>(email);

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
          onChange={e => setNewUSername(e.target.value)}
        />
        <button disabled={newUsername === username || newUsername.length <= 0}>
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
        />
        <button disabled={newEmail === email || newEmail.length <= 0}>
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
        />
        <input
          placeholder='New Password'
          type='password'
          name='newPassword'
          id='newPassword'
        />
        <input
          placeholder='Confirm Password'
          type='password'
          name='confirmPassword'
          id='confirmPassword'
        />
        <button>Save</button>
      </div>
      <button className='PrimaryButton--red AccountSettings__DeleteAccount'>
        Delete Account
      </button>
    </div>
  );
};

export default Account;
