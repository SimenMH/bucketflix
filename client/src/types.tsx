export interface Media {
  imdbID: string;
  title: string;
  year: string;
  type: string;
  plot: string;
  poster: string;
}

export interface List {
  name: string;
  movies: Array<Media>;
  series: Array<Media>;
}
