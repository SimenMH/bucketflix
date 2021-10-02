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
    user.lists.push(createdList._id);
    await user.save();

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

const addMedia = asyncHandler(async (req, res) => {
  const { listID, media } = req.body;
  if (!media.imdbID || !media.Title || !media.Type) {
    res.status(400);
    throw new Error('Invalid media data');
  }

  const category = media.Type === 'movie' ? 'movies' : 'series';
  const list = await List.findById(listID);

  if (!list) {
    res.status(404);
    throw new Error('Could not find any lists with this ID');
  }

  if (list.user_id != req.user._id) {
    res.status(403);
    throw new Error('Unauthorized to edit this list');
  }

  const mediaExists = list[category].filter(
    mediaItem =>
      mediaItem.imdbID === media.imdbID && mediaItem.Title === media.Title
  );
  if (mediaExists.length) {
    res.status(400);
    throw new Error('Media already exists in this list');
  }

  list[category].push(media);
  await list.save();
  res.status(201).json(list);
});

const editMedia = asyncHandler(async (req, res) => {
  const { listID, mediaIdx, updatedMedia } = req.body;

  const list = await List.findById(listID);

  if (!list) {
    res.status(404);
    throw new Error('Could not find any lists with this ID');
  }

  if (list.user_id != req.user._id) {
    res.status(403);
    throw new Error('Unauthorized to edit this list');
  }

  const category = updatedMedia.Type === 'movie' ? 'movies' : 'series';
  const media = list[category][mediaIdx];

  if (!media) {
    res.status(404);
    throw new Error('Media index out of range');
  }

  if (
    media.Title != updatedMedia.Title ||
    media.imdbID != updatedMedia.imdbID
  ) {
    res.status(404);
    throw new Error('Updated media does not match media index');
  }

  media.Timestamp = updatedMedia.Timestamp;
  media.WhereToWatch = updatedMedia.WhereToWatch;
  media.Notes = updatedMedia.Notes;

  list[category][mediaIdx] = media;
  await list.save();
  res.status(200).json(list);
});

const deleteMedia = asyncHandler(async (req, res) => {
  const { listID, media } = req.body;

  const list = await List.findById(listID);

  if (!list) {
    res.status(404);
    throw new Error('Could not find any lists with this ID');
  }

  if (list.user_id != req.user._id) {
    res.status(403);
    throw new Error('Unauthorized to edit this list');
  }

  const category = media.Type === 'movie' ? 'movies' : 'series';

  list[category] = list[category].filter(
    mediaItem =>
      mediaItem.imdbID != media.imdbID && mediaItem.Title != media.Title
  );

  await list.save();
  res.status(200).json(list);
});

export { getLists, createList, editList, addMedia, editMedia, deleteMedia };
