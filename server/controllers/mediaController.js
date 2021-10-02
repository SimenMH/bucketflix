import asyncHandler from 'express-async-handler';

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
  const { mediaIdx, updatedMedia } = req.body;
  const list = req.list;

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
  const { media } = req.body;
  const list = req.list;

  const category = media.Type === 'movie' ? 'movies' : 'series';

  list[category] = list[category].filter(
    mediaItem =>
      mediaItem.imdbID != media.imdbID || mediaItem.Title != media.Title
  );

  await list.save();
  res.status(200).json(list);
});

export { addMedia, editMedia, deleteMedia };
