import asyncHandler from 'express-async-handler';
import List from '../models/listModel.js';

const addMedia = asyncHandler(async (req, res) => {
  const { media } = req.body;
  const list = req.list;
  if (!media.imdbID || !media.Title || !media.Type) {
    res.status(400);
    throw new Error('Invalid media data');
  }

  const category = media.Type === 'movie' ? 'movies' : 'series';

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
  const { listID, mediaID, type, updatedValues } = req.body;

  if (!type) {
    res.status(400);
    throw new Error('Missing media type in request body');
  }

  const category = type === 'movie' ? 'movies' : 'series';

  const updatedList = await List.findOneAndUpdate(
    { _id: listID, [category]: { $elemMatch: { _id: mediaID } } },
    {
      $set: {
        [`${category}.$.Timestamp`]: updatedValues.Timestamp,
        [`${category}.$.WhereToWatch`]: updatedValues.WhereToWatch,
        [`${category}.$.Notes`]: updatedValues.Notes,
      },
    },
    { new: true }
  );

  res.status(200).json(updatedList);
});

const deleteMedia = asyncHandler(async (req, res) => {
  const { mediaID } = req.body;
  const list = req.list;

  await list.movies.pull(mediaID);
  await list.series.pull(mediaID);

  await list.save();
  res.status(200).json(list);
});

export { addMedia, editMedia, deleteMedia, testMedia };
