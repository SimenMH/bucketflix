import asyncHandler from 'express-async-handler';
import List from '../models/listModel.js';
import User from '../models/userModel.js';
import ListInvite from '../models/listInviteModel.js';

const getLists = asyncHandler(async (req, res) => {
  const userID = req.user._id;

  const lists = await List.find({ user_id: userID }).select('-user_id');
  const shared_lists = await List.find({
    'sharedUsers.user_id': userID,
  }).select('-sharedUsers');

  res.status(200).json({ lists, shared_lists });
});

const createList = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const user = await User.findById(req.user._id);

  const listExists = await List.findOne({ user_id: user._id, name });

  if (listExists) {
    res.status(400);
    throw new Error('A list with that name already exists');
  }

  try {
    const createdList = await List.create({ user_id: user._id, name });

    if (createdList) {
      res.status(201).json(createdList);
    } else {
      res.status(400);
      throw new Error('Invalid list data');
    }
  } catch (err) {
    res.status(400);
    if (err.errors.name.kind === 'maxlength') {
      throw new Error(`${name} is longer than the maximum allowed length (15)`);
    } else {
      throw new Error(err);
    }
  }
});

const editList = asyncHandler(async (req, res) => {
  const { updatedValues } = req.body;

  if (!updatedValues) {
    res.status(400);
    throw new Error('Value is required: updatedValues');
  }

  const list = req.list;

  if (updatedValues.hasOwnProperty('name')) list.name = updatedValues.name;

  try {
    await list.save();
    res.status(200).json(list);
  } catch (err) {
    res.status(400);
    if (err.errors.name.kind === 'maxlength') {
      throw new Error(
        `${updatedValues.name} is longer than the maximum allowed length (15)`
      );
    } else {
      throw new Error(err);
    }
  }
});

const deleteList = asyncHandler(async (req, res) => {
  const { listID } = req.body;

  await List.deleteOne({ _id: listID });
  res.sendStatus(204);
});

// Shared Users

const addSharedUser = asyncHandler(async (req, res) => {
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

const editSharedUser = asyncHandler(async (req, res) => {
  const { sharedUserID, updatedValues } = req.body;

  if (!updatedValues) {
    res.status(400);
    throw new Error('Value is required: updatedValues');
  }

  if (updatedValues.hasOwnProperty('canEdit')) {
    const idx = req.list.sharedUsers.findIndex(
      el => el.user_id.toString() === sharedUserID
    );

    if (idx > -1) {
      req.list.sharedUsers[idx].canEdit = updatedValues.canEdit;
    } else {
      throw new Error('Could not find shared user ID on specified list');
    }
  }

  await req.list.save();
  res.status(200).json(req.list);
});

const removeSharedUser = asyncHandler(async (req, res) => {
  const { sharedUserID } = req.body;

  const idx = req.list.sharedUsers.findIndex(
    el => el.user_id.toString() === sharedUserID
  );

  if (idx > -1) {
    req.list.sharedUsers.splice(idx, 1);
  } else {
    throw new Error('Could not find shared user ID on specified list');
  }

  await req.list.save();
  res.status(200).json(req.list);
});

export {
  getLists,
  createList,
  editList,
  deleteList,
  addSharedUser,
  editSharedUser,
  removeSharedUser,
};
