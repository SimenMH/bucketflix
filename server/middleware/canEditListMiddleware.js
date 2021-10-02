import asyncHandler from 'express-async-handler';
import List from '../models/listModel.js';

const canEditList = asyncHandler(async (req, res, next) => {
  console.log('checking if can edit');
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
  req.list = list;
  next();
});

export default canEditList;
