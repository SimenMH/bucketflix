import asyncHandler from 'express-async-handler';
import referralCodes from 'referral-codes';

import ListInvite from '../models/listInviteModel.js';

const createInvite = asyncHandler(async (req, res) => {
  const { listID } = req.body;
  const userID = req.user._id;

  var inviteCode = null;

  while (!inviteCode) {
    const code = referralCodes.generate({ length: 8 })[0];
    const codeExists = await ListInvite.findOne({ invite_code: code });

    if (!codeExists) {
      inviteCode = code;
    }
  }

  const listInvite = await ListInvite.create({
    owner_id: userID,
    list_id: listID,
    invite_code: inviteCode,
  });

  res.status(201).json({ inviteCode: listInvite.invite_code });
});

export { createInvite };
