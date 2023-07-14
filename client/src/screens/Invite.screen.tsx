import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '../redux/Hooks';
import { updateSelectedList } from '../redux/List/ListSlice';
import { AxiosResponse } from 'axios';
import { axiosAuthInstance } from '../api/AxiosInstances';
import { History } from 'history';
import { List } from '../types';

enum CodeStatus {
  PENDING,
  VALID,
  INVALID,
  EXPIRED,
  UNAUTHORIZED,
  ERROR,
}

interface InviteInfo {
  listName: string;
  listOwner: string;
}

interface Props {
  history: History;
}

const Invite: React.FC<Props> = ({ history }) => {
  // Redux
  const dispatch = useAppDispatch();

  // React States
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [codeStatus, setCodeStatus] = useState<CodeStatus>(CodeStatus.PENDING);
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);

  const checkInviteCode = useCallback(async (code: string | null) => {
    try {
      const res: AxiosResponse<InviteInfo> = await axiosAuthInstance.get(
        `/lists/invite?i=${code}`
      );

      setInviteCode(code);
      setInviteInfo(res.data);
      setCodeStatus(CodeStatus.VALID);
    } catch (err: any) {
      if (err.response) {
        const response = err.response;
        const status = response.status;

        switch (status) {
          case 404:
            // Invalid code
            setCodeStatus(CodeStatus.INVALID);
            break;
          case 410:
            // Expired/Used code
            setCodeStatus(CodeStatus.EXPIRED);
            break;
          case 400:
            // Owns or already in list
            setCodeStatus(CodeStatus.UNAUTHORIZED);
            break;
          default:
            // Unknown error
            setCodeStatus(CodeStatus.ERROR);
            break;
        }
      } else {
        // Unknown error
        setCodeStatus(CodeStatus.ERROR);
      }
    }
  }, []);

  const handleAcceptInvite = async () => {
    try {
      const res: AxiosResponse<List> = await axiosAuthInstance.post(
        `/lists/users?i=${inviteCode}`
      );

      await dispatch(updateSelectedList({ ...res.data, canEdit: false }));
      history.push('/');
    } catch (err) {
      setCodeStatus(CodeStatus.ERROR);
    }
  };

  const renderContent = () => {
    switch (codeStatus) {
      case CodeStatus.PENDING:
        return <div>Verifying invite...</div>;
      case CodeStatus.VALID:
        return (
          <div className='InviteScreen__ValidContainer'>
            <div>
              {inviteInfo?.listOwner} has invited you to join{' '}
              {inviteInfo?.listName}!
            </div>
            <button
              className='InviteScreen__AcceptButton'
              onClick={handleAcceptInvite}
            >
              Accept Invite
            </button>
          </div>
        );
      case CodeStatus.INVALID:
        return (
          <div>Sorry, but we couldn't find any invites with this code :(</div>
        );
      case CodeStatus.EXPIRED:
        return <div>This invite has either expired or already been used</div>;
      case CodeStatus.UNAUTHORIZED:
        return <div>You are already in this list!</div>;
      case CodeStatus.ERROR:
        return (
          <div>We experienced an unknown error, please try again later! :(</div>
        );
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has('i')) {
      checkInviteCode(urlParams.get('i'));
    } else {
      setCodeStatus(CodeStatus.INVALID);
    }
  }, [checkInviteCode]);

  return (
    <div className='InviteScreen'>
      {renderContent()}
      <button
        className='InviteScreen__ReturnButton'
        onClick={() => history.push('/')}
      >
        Return
      </button>
    </div>
  );
};

export default Invite;
