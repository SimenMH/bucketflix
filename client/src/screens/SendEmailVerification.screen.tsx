import axios from 'axios';
import { useState } from 'react';

const SendEmailVerification: React.FC = () => {
  // React states
  const [email, setEmail] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const handleSendVerificationEmail = async () => {
    try {
      await axios.post(`/users/verify-email`, { email });
      setEmailSent(true);
    } catch (err: any) {
      if (err.response.data && err.response.data.message) {
        setErrorText(err.response.data.message);
      } else {
        setErrorText('Unknown error occured, please try again later.');
      }
    }
  };

  return (
    <div className='SendEmailVerification'>
      {emailSent ? (
        <div>
          <h2>Verification email has been sent!</h2>
          <p>
            Check your inbox and follow the instructions to finish verifying
            your account
          </p>
        </div>
      ) : (
        <>
          <h2>Send new verification email</h2>
          <div>
            <input
              type='email'
              name='email'
              id='email'
              autoComplete='email'
              placeholder='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required={true}
            />
            <button
              className='PrimaryButton'
              onClick={handleSendVerificationEmail}
              disabled={!email}
            >
              Send
            </button>
          </div>
          {errorText && <div className='ErrorText'>{errorText}</div>}
        </>
      )}
    </div>
  );
};

export default SendEmailVerification;
