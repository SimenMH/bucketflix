import asyncHandler from 'express-async-handler';
import List from '../models/listModel.js';

const canEditList = asyncHandler(async (req, res, next) => {
  const { listID } = req.body;

  const list = await List.findById(listID);

  if (!list) {
    res.status(404);
    throw new Error('Could not find any lists with this ID');
  }

  if (list.user_id != req.user._id) {
    const sharedUsers = list.sharedUsers;
    const idx = req.list.sharedUsers.findIndex(
      el => el.user_id.toString() === req.user._id
    );

    if (idx === -1 || !sharedUsers[idx].canEdit) {
      res.status(403);
      throw new Error('Unauthorized to edit this list');
    }
  }

  req.list = list;
  next();
});

export default canEditList;
