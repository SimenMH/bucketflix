import mongoose from 'mongoose';
import mediaSchema from './schemas/mediaSchema.js';

const listSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxLength: 30,
  },
  movies: [mediaSchema],
  series: [mediaSchema],
  sharedUsers: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      canEdit: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const List = mongoose.model('List', listSchema);

export default List;
