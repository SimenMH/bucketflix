export interface Media {
  _id?: string;
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Plot: string;
  Poster: string;
  Timestamp: string;
  WhereToWatch: string;
  Notes: string;
}

export interface List {
  _id: string;
  name: string;
  movies: Array<Media>;
  series: Array<Media>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
