import mongoose from 'mongoose';

const mediaSchema = mongoose.Schema({
  imdbID: {
    type: String,
    default: '',
    maxLength: 30,
  },
  Title: {
    type: String,
    required: true,
    maxLength: 200,
  },
  Year: {
    type: String,
    default: '',
    maxLength: 30,
  },
  Type: {
    type: String,
    required: true,
  },
  Plot: {
    type: String,
    default: '',
    maxLength: 300,
  },
  Poster: {
    type: String,
    default: '',
    maxLength: 300,
  },
  Timestamp: {
    type: String,
    default: '',
    maxLength: 150,
  },
  WhereToWatch: {
    type: String,
    default: '',
    maxLength: 200,
  },
  Notes: {
    type: String,
    default: '',
    maxLength: 300,
  },
});

export default mediaSchema;
