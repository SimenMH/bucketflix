import axios from 'axios';
import { useState, useEffect } from 'react';
import { History } from 'history';

enum PasswordResetStatus {
  INPUT,
  PENDING,
  SUCCESS,
  FAILURE,
}

interface Props {
  history: History;
}

const PasswordReset: React.FC<Props> = ({ history }) => {
  // React states
  const [passwordResetToken, setPasswordResetToken] = useState<string | null>(
    null
  );
  const [passwordResetStatus, setPasswordResetStatus] =
    useState<PasswordResetStatus>(PasswordResetStatus.INPUT);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const renderPasswordResetStatus = () => {
    switch (passwordResetStatus) {
      case PasswordResetStatus.INPUT:
        return (
          <div>
            <form
              className='PasswordReset__PasswordForm'
              onSubmit={handleUpdatePassword}
            >
              <div className='PasswordReset__FormInput'>
                <label htmlFor='newPassword'>New Password:</label>
                <input
                  type='password'
                  name='newPassword'
                  id='newPassword'
                  autoComplete='new-password'
                  placeholder='New Password'
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required={true}
                />
              </div>
              <div className='PasswordReset__FormInput'>
                <label htmlFor='confirmPassword'>Confirm Password:</label>
                <input
                  type='password'
                  name='confirmPassword'
                  id='confirmPassword'
                  autoComplete='new-password'
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required={true}
                />
              </div>
              {errorText && <div className='ErrorText'>{errorText}</div>}
              <button className='Primary Button' type='submit'>
                Update Password
              </button>
            </form>
          </div>
        );
      case PasswordResetStatus.PENDING:
        return <h1>Updating password...</h1>;
      case PasswordResetStatus.SUCCESS:
        return (
          <div>
            <h2>Your password has been updated!</h2>
            <p>
              Your password has been successfully updated, you may now log in
              using your new password and begin using Bucketflix
            </p>
            <button
              className='PrimaryButton'
              onClick={() => history.push('/login')}
            >
              Go to login
            </button>
          </div>
        );
      case PasswordResetStatus.FAILURE:
        return (
          <div>
            <h2>Something went wrong...</h2>
            <div>{errorText}</div>
          </div>
        );
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText('');
    if (newPassword !== confirmPassword) {
      setErrorText('Passwords must match');
      return;
    }

    try {
      await axios.put(`/users/reset-password`, {
        token: passwordResetToken,
        newPassword,
      });
      setPasswordResetStatus(PasswordResetStatus.SUCCESS);
    } catch (err: any) {
      if (err.response.data && err.response.data.message) {
        setErrorText(err.response.data.message);
      } else {
        setErrorText('Unknown error occured, please try again later.');
      }
      setPasswordResetStatus(PasswordResetStatus.FAILURE);
    }
  };

  const handleSendPasswordReset = async () => {
    try {
      await axios.post(`/users/reset-password`, { email });
      setEmailSent(true);
    } catch (err: any) {
      if (err.response.data && err.response.data.message) {
        setErrorText(err.response.data.message);
      } else {
        setErrorText('Unknown error occured, please try again later.');
      }
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has('token')) {
      setPasswordResetToken(urlParams.get('token'));
    }
  }, []);

  return (
    <div className='PasswordReset'>
      {passwordResetToken ? (
        renderPasswordResetStatus()
      ) : (
        <div>
          {emailSent ? (
            <div>
              <h2>Password reset has been sent!</h2>
              <p>
                Check your inbox and follow the instructions to reset your
                password
              </p>
            </div>
          ) : (
            <>
              <h2>Reset Your Password</h2>
              <p>Please enter your email to reset your password.</p>
              <div>
                <input
                  type='email'
                  name='email'
                  id='email'
                  autoComplete='email'
                  placeholder='Your Email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required={true}
                />
                <button
                  className='PrimaryButton'
                  onClick={handleSendPasswordReset}
                  disabled={!email}
                >
                  Send
                </button>
              </div>
              {errorText && <div className='ErrorText'>{errorText}</div>}
              <button
                className='PrimaryButton PasswordReset__BackToLogin'
                onClick={() => history.push('/login')}
              >
                Back to login
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordReset;
