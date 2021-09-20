export interface Media {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Plot: string;
  Poster: string;
}

export interface List {
  name: string;
  movies: Array<Media>;
  series: Array<Media>;
}
