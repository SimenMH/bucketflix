export interface Media {
  title: string;
  year: string;
  type: string;
  plot: string;
  poster: string;
}

export const tempMovies: Array<Media> = [
  {
    title: 'Hachikô monogatari',
    year: '1987',
    type: 'movie',
    plot: "The true story about a dog's loyalty to its master, even after his death.",
    poster:
      'https://m.media-amazon.com/images/M/MV5BN2RkM2I2MDQtYWFiNy00NzA1LTkyOGItYTU1MWQxYzkwODQ4XkEyXkFqcGdeQXVyNjYyMTYxMzk@._V1_SX300.jpg',
  },
  {
    title: 'Django Unchained',
    year: '2012',
    type: 'movie',
    plot: 'With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation-owner in Mississippi.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_SX300.jpg',
  },
  {
    title: 'Up',
    year: '2009',
    type: 'movie',
    plot: '78-year-old Carl Fredricksen travels to Paradise Falls in his house equipped with balloons, inadvertently taking a young stowaway.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMTk3NDE2NzI4NF5BMl5BanBnXkFtZTgwNzE1MzEyMTE@._V1_SX300.jpg',
  },
  {
    title: 'The Terminal',
    year: '2004',
    type: 'movie',
    plot: 'An Eastern European tourist unexpectedly finds himself stranded in JFK airport, and must take up temporary residence there.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMTM1MTIwNTMxOF5BMl5BanBnXkFtZTcwNjIxMjQyMw@@._V1_SX300.jpg',
  },
];

export const tempSeries: Array<Media> = [
  {
    title: 'Sherlock',
    year: '2010-2017',
    type: 'series',
    plot: 'A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMWY3NTljMjEtYzRiMi00NWM2LTkzNjItZTVmZjE0MTdjMjJhL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTQ4NTc5OTU@._V1_SX300.jpg',
  },
  {
    title: 'You',
    year: '2018-',
    type: 'series',
    plot: 'A dangerously charming, intensely obsessive young man goes to extreme measures to insert himself into the lives of those he is transfixed by.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BZDJjOTg4OWYtYWIyOS00MjQ3LTg5ZDktYzU2N2RkNmYzNjZlXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_SX300.jpg',
  },
  {
    title: 'Lucifer',
    year: '2016-2021',
    type: 'series',
    plot: "Lucifer Morningstar has decided he's had enough of being the dutiful servant in Hell and decides to spend some time on Earth to better understand humanity. He settles in Los Angeles - the City of Angels.",
    poster:
      'https://m.media-amazon.com/images/M/MV5BNDJjMzc4NGYtZmFmNS00YWY3LThjMzQtYzJlNGFkZGRiOWI1XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg',
  },
  {
    title: 'Vikings',
    year: '2013-2020',
    type: 'series',
    plot: 'Vikings transports us to the brutal and mysterious world of Ragnar Lothbrok, a Viking warrior and farmer who yearns to explore - and raid - the distant shores across the ocean.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BODk4ZjU0NDUtYjdlOS00OTljLTgwZTUtYjkyZjk1NzExZGIzXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg',
  },
];
