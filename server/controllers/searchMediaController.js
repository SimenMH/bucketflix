import asyncHandler from 'express-async-handler';
import NodeCache from 'node-cache';

const cacheTTL = 7 * 24 * 60 * 60; // 2 week
const cacheCheckPeriod = 12 * 60 * 60; // 12 hours

const titleSearchCache = new NodeCache({
  stdTTL: cacheTTL,
  checkperiod: cacheCheckPeriod,
});
const idSearchCache = new NodeCache({
  stdTTL: cacheTTL,
  checkperiod: cacheCheckPeriod,
});

const baseUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}`;

const categories = ['movie', 'series'];

const searchForTitles = title => {
  title = title.trim().replace(' ', '+');
  return fetch(`${baseUrl}&s=${title}`)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));
};

const searchByTitle = title => {
  title = title.trim().replace(' ', '+');
  return fetch(`${baseUrl}&t=${title}`)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));
};

const searchById = imdbID => {
  return fetch(`${baseUrl}&i=${imdbID}`)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));
};

const searchForMedia = asyncHandler(async (req, res) => {
  let title = req.query['s'];
  if (!title) {
    res.status(400);
    throw new Error('Missing title in request query');
  }
  title = title.toLowerCase().trim();

  let results = [];

  // Search cache
  const cacheResult = titleSearchCache.get(title);

  if (cacheResult !== undefined) {
    results = cacheResult;
  } else {
    // Search OMDB
    const multipleTitles = await searchForTitles(title);

    if (multipleTitles.Response === 'True') {
      results = [...multipleTitles.Search];
    }

    const singleTitle = await searchByTitle(title);

    if (singleTitle.Response === 'True') {
      if (!results.some(media => media.imdbID === singleTitle.imdbID)) {
        results.unshift(singleTitle);
      }
    }

    results = results.filter(item => categories.includes(item.Type));

    titleSearchCache.set(title, results);
  }

  // Return results
  res.status(200).json({ results });
});

const searchForMediaById = asyncHandler(async (req, res) => {
  const { mediaID } = req.params;

  let result;

  // Check cache
  const cacheResult = idSearchCache.get(mediaID);
  if (cacheResult !== undefined) {
    result = cacheResult;
  } else {
    // Search OMDB
    result = await searchById(mediaID);
    idSearchCache.set(mediaID, result);
  }

  if (result.Type && !categories.includes(result.Type)) {
    result.Response = 'False';
  }

  // Return results
  if (result.Response === 'True') {
    res.status(200).json(result);
  } else {
    res.status(404);
    throw new Error('Found no titles with this ID');
  }
});

export { searchForMedia, searchForMediaById };
