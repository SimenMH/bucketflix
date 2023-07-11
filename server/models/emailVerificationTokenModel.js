import mongoose from 'mongoose';

const emailVerificationTokenSchema = mongoose.Schema({
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

const EmailVerificationToken = mongoose.model(
  'ConfirmEmailToken',
  emailVerificationTokenSchema
);

export default EmailVerificationToken;
