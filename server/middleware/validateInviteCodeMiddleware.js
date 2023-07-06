import asyncHandler from 'express-async-handler';
import List from '../models/listModel.js';
import ListInvite from '../models/listInviteModel.js';

const validateInviteCode = asyncHandler(async (req, res) => {
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
    res.status(410); // 410 Gone
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

  req.listInvite = listInvite;
  req.list = list;
  next();
});

export default validateInviteCode;
