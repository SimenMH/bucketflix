import mongoose from 'mongoose';

const mediaSchema = mongoose.Schema({
  imdbID: {
    type: String,
    default: '',
  },
  Title: {
    type: String,
    required: true,
  },
  Year: {
    type: String,
    default: '',
  },
  Type: {
    type: String,
    required: true,
  },
  Plot: {
    type: String,
    default: '',
  },
  Poster: String,
  Timestamp: {
    type: String,
    default: '',
  },
  WhereToWatch: {
    type: String,
    default: '',
  },
  Notes: {
    type: String,
    default: '',
  },
});

export default mediaSchema;
