import asyncHandler from 'express-async-handler';
import referralCodes from 'referral-codes';

import ListInvite from '../models/listInviteModel.js';
import List from '../models/listModel.js';

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

  res.status(201).json({ listInvite });
});

const useInvite = asyncHandler(async (req, res) => {
  const inviteCode = req.query.i;
  const user = req.user;

  if (!inviteCode) {
    res.status(404);
    throw new Error('Missing invite code in query parameters');
  }

  const listInvite = await ListInvite.findOne({ invite_code: inviteCode });

  if (!listInvite) {
    res.status(404);
    throw new Error(`Could not find invite with code ${inviteCode}`);
  }

  const dateNow = new Date();
  const elapsedTime = dateNow - listInvite.createdAt;
  if (elapsedTime > 60 * 60 || listInvite.used_by_id) {
    res.status(410); // 401 Gone
    throw new Error('Invite has expired or already been used');
  }

  const list = await List.findById(listInvite.list_id);

  if (!list) {
    res.status(404);
    throw new Error('List can no longer be found');
  }

  if (list.user_id === user._id) {
    res.status(400);
    throw new Error('Cannot invite yourself to your own list');
  }

  if (list.sharedUsers.find(el => el.user_id.toString() === user._id)) {
    res.status(400);
    throw new Error('User already has access to this list');
  }

  listInvite.used_by_id = user._id;

  list.sharedUsers.push({
    user_id: user._id,
    username: user.username,
  });

  await listInvite.save();
  await list.save();

  res.status(201).json(list);
});

export { createInvite, useInvite };
