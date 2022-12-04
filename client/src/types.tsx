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

export interface SharedUser {
  user_id: string;
  username: string;
  canEdit: boolean;
}

export interface List {
  _id: string;
  name: string;
  movies: Array<Media>;
  series: Array<Media>;
  sharedUsers: Array<SharedUser>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface EditMediaData {
  listID: string;
  mediaID: string;
  type: string;
  updatedValues: {
    timestamp: string;
    whereToWatch: string;
    notes: string;
  };
}
