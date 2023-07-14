import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../redux/Hooks';
import { History } from 'history';

enum VerifyStatus {
  PENDING,
  SUCCESS,
  FAILURE,
}

interface Props {
  history: History;
}

const EmailVerification: React.FC<Props> = ({ history }) => {
  // Redux
  const { loggedIn } = useAppSelector(state => state.user);

  // React states
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null
  );
  const [verificationStatus, setVerificationStatus] = useState<VerifyStatus>(
    VerifyStatus.PENDING
  );
  const [errorText, setErrorText] = useState<string>('');

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case VerifyStatus.PENDING:
        return <h1>Verifying...</h1>;
      case VerifyStatus.SUCCESS:
        return (
          <div>
            <h2>Your email has been verified!</h2>
            {loggedIn ? (
              <>
                <p>
                  Your email has been successfully verified, you may now log in
                  using your new email address
                </p>
                <button
                  className='PrimaryButton'
                  onClick={() => history.push('/')}
                >
                  Back to my lists
                </button>
              </>
            ) : (
              <>
                <p>
                  Your email has been successfully verified, you may now log in
                  and begin using Bucketflix
                </p>
                <button
                  className='PrimaryButton'
                  onClick={() => history.push('/login')}
                >
                  Go to login
                </button>
              </>
            )}
          </div>
        );
      case VerifyStatus.FAILURE:
        return (
          <div>
            <h2>Something went wrong...</h2>
            <div>{errorText}</div>
          </div>
        );
    }
  };

  const verifyEmail = useCallback(async () => {
    try {
      await axios.put(`/users/verify-email`, { token: verificationToken });
      setVerificationStatus(VerifyStatus.SUCCESS);
    } catch (err: any) {
      if (err.response.data && err.response.data.message) {
        setErrorText(err.response.data.message);
      } else {
        setErrorText('Unknown error occured, please try again later.');
      }
      setVerificationStatus(VerifyStatus.FAILURE);
    }
  }, [verificationToken]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has('token')) {
      setVerificationToken(urlParams.get('token'));
      verifyEmail();
    } else if (loggedIn) {
      history.push('/');
    }
  }, [verifyEmail, loggedIn, history]);

  return (
    <div className='EmailVerification'>
      {verificationToken ? (
        renderVerificationStatus()
      ) : (
        <div>
          <h2>Confirm your email address to get started on Bucketflix</h2>
          <p>
            Registration was a success, but before you can log in you must
            confirm your email address. An email with further instructions has
            been sent to your inbox.
          </p>
          <p>
            Didn't receive an email? Click{' '}
            <span
              className='LinkText'
              onClick={() => history.push('/verify-email/new')}
            >
              here
            </span>{' '}
            to send another
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
