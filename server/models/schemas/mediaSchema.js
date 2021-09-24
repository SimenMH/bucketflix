import mongoose from 'mongoose';

const mediaSchema = mongoose.Schema({
  imdbID: {
    type: String,
    required: true,
  },
  Title: {
    type: String,
    required: true,
  },
  Year: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Plot: {
    type: String,
    required: true,
  },
  Poster: {
    type: String,
    required: true,
  },
  Timestamp: {
    type: String,
    required: true,
  },
  WhereToWatch: {
    type: String,
    required: true,
  },
  Notes: {
    type: String,
    required: true,
  },
});

export default mediaSchema;
