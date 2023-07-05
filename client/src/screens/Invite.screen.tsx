import { useEffect, useState } from 'react';

const inviteCode: string = '';

const Invite = () => {
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const checkInviteCode = async (code: string | null) => {
    // Send get with credentials that only checks if invite code is valid
    // If not logged in, prompt user to login or signup
    // If is owner of list invite, display error
    // If expired or doesn't exist, display error
    // If valid invite and logged in, prompt if user wants to accept
    // On accept, send post that uses the invite
    const res = await fetch(`https://localhost:5000/invite?${code}`);

    console.log(res);
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has('i')) {
      checkInviteCode(urlParams.get('i'));
    }
  }, []);

  return <></>;
};
