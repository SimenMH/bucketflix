import mongoose from 'mongoose';

const passwordResetTokenSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const PasswordResetToken = mongoose.model(
  'PasswordResetToken',
  passwordResetTokenSchema
);

export default PasswordResetToken;
