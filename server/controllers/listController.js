import asyncHandler from 'express-async-handler';
import List from '../models/listModel.js';
import User from '../models/userModel.js';

const getLists = asyncHandler(async (req, res) => {
  const userID = req.user._id;

  const lists = await List.find({ userID }).select('-user_id');
  const shared_lists = await List.find({
    'shared_users.user_id': userID,
  }).select('-shared_users');

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

  const createdList = await List.create({ user_id: user._id, name });

  if (createdList) {
    res.status(201).json(createdList);
  } else {
    res.status(400);
    throw new Error('Invalid list data');
  }
});

const editList = asyncHandler(async (req, res) => {
  const { listID, updatedValues } = req.body;

  const list = await List.findById(listID);

  if (!list) {
    res.status(404);
    throw new Error('Could not find any lists with this ID');
  }

  if (list.user_id != req.user._id) {
    res.status(403);
    throw new Error('Unauthorized to edit this list');
  }

  if (updatedValues.name) list.name = updatedValues.name;
  if (updatedValues.sharedUsers) list.shared_users = updatedValues.shared_users;

  await list.save();
  res.status(200).json(list);
});

const deleteList = asyncHandler(async (req, res) => {
  const { listID } = req.body;

  const list = await List.findById(listID);

  if (!list) {
    res.status(404);
    throw new Error('Could not find any lists with this ID');
  }

  if (list.user_id != req.user._id) {
    res.status(403);
    throw new Error('Unauthorized to edit this list');
  }

  await List.deleteOne({ _id: listID });
  res.sendStatus(204);
});

export { getLists, createList, editList, deleteList };
