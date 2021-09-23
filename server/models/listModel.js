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
  },
  movies: [mediaSchema],
  series: [mediaSchema],
  /*shared_users: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      can_edit: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ], */
});

const List = mongoose.model('List', listSchema);

export default List;
