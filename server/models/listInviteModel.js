import mongoose from 'mongoose';

const listInviteSchema = mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  list_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true,
  },
  used_by_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  invite_code: {
    type: String,
    required: true,
  },
});

const ListInvite = mongoose.model('ListInvite', listInviteSchema);

export default ListInvite;
