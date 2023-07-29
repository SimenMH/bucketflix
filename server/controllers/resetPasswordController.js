import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '../utils/sendEmail.js';

import PasswordResetToken from '../models/passwordResetTokenModel.js';
import User from '../models/userModel.js';

const sendPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(404);
    throw new Error('Missing email in request body');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('No account with this email address exists.');
  }

  // Delete old verification tokens
  await PasswordResetToken.deleteMany({ userID: user._id });

  // Generate email verification token
  const passwordResetToken = jwt.sign(
    { userID: user._id },
    process.env.RESET_PASSWORD_TOKEN_SECRET
  );

  const token = await PasswordResetToken.create({
    userID: user._id,
    token: passwordResetToken,
  });

  if (!token) {
    res.status(500);
    throw new Error(
      'Something went wrong when generating password reset code. Try again later.'
    );
  }

  // Send email
  await sendPasswordResetEmail(user.email, passwordResetToken);

  res.status(201).json({
    message:
      'An email with directions to reset your password has been sent to your inbox.',
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token) {
    res.status(404);
    throw new Error('Missing token in request body');
  }

  const passwordResetToken = await PasswordResetToken.findOne({
    token,
  });

  if (!passwordResetToken) {
    res.status(400);
    throw new Error('Invalid token');
  }

  const dateNow = new Date();
  const elapsedTime = dateNow - passwordResetToken.createdAt;
  // 30 minutes
  if (elapsedTime > 30 * 60 * 1000) {
    res.status(410); // 410 Gone
    throw new Error('Token has expired');
  }

  const decoded = jwt.verify(
    passwordResetToken.token,
    process.env.RESET_PASSWORD_TOKEN_SECRET
  );

  const user = await User.findById(decoded.userID);

  if (!user) {
    res.status(404);
    throw new Error(
      'Could not find a user associated with this token. Contact support if this issue persists'
    );
  }

  user.password = newPassword; // Hash this

  await user.save();

  await PasswordResetToken.findByIdAndDelete(passwordResetToken._id);

  res.status(200).json({ message: 'Password successfully updated!' });
});

export { sendPasswordReset, updatePassword };
