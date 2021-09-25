import asyncHandler from 'express-async-handler';
import List from '../models/listModel.js';
import User from '../models/userModel.js';

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
    user.lists.push(createdList._id);
    await user.save();

    res.status(201).json(createdList);
  } else {
    res.status(400);
    throw new Error('Invalid list data');
  }
});

export { createList };
