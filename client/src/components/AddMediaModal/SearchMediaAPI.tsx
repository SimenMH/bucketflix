const baseUrl = `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}`;

export const searchForTitle = (title: string) => {
  title = title.replace(' ', '+');
  return fetch(`${baseUrl}&s=${title}`)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));
};

export const searchById = (imdbID: string) => {
  return fetch(`${baseUrl}&i=${imdbID}`)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));
};

export const searchByTitle = (title: string) => {
  title = title.replace(' ', '+');
  return fetch(`${baseUrl}&t=${title}`)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));
};
