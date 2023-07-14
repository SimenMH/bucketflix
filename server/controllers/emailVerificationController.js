import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/sendEmail.js';

import EmailVerificationToken from '../models/emailVerificationTokenModel.js';
import User from '../models/userModel.js';
import generateAccessToken from '../utils/generateAccessToken.js';

const sendNewEmailVerification = asyncHandler(async (req, res) => {
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

  if (user.active) {
    res.status(400);
    throw new Error('This account has already been verified. Try logging in.');
  }

  // Delete old verification tokens
  await EmailVerificationToken.deleteMany({ userID: user._id });

  // Generate email verification token
  const emailVerificationToken = jwt.sign(
    { userID: user._id },
    process.env.EMAIL_VERIFICATION_TOKEN_SECRET
  );

  const token = await EmailVerificationToken.create({
    userID: user._id,
    token: emailVerificationToken,
  });

  if (!token) {
    res.status(500);
    throw new Error(
      'Something went wrong when generating email verification code. Try again later.'
    );
  }

  // Send email
  await sendVerificationEmail(user.email, emailVerificationToken);

  res.status(201).json({
    message:
      'An email has been sent to your inbox, please verify your email to complete the registration.',
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(404);
    throw new Error('Missing token in request body');
  }

  const emailVerificationToken = await EmailVerificationToken.findOne({
    token,
  });

  if (!emailVerificationToken) {
    res.status(400);
    throw new Error('Invalid token');
  }

  const dateNow = new Date();
  const elapsedTime = dateNow - emailVerificationToken.createdAt;
  // 30 minutes
  if (elapsedTime > 30 * 60) {
    res.status(410); // 410 Gone
    throw new Error('Token has expired');
  }

  const decoded = jwt.verify(
    emailVerificationToken.token,
    process.env.EMAIL_VERIFICATION_TOKEN_SECRET
  );

  const user = await User.findById(decoded.userID);

  if (!user) {
    res.status(404);
    throw new Error(
      'Could not find a user associated with this token. Contact support if this issue persists'
    );
  }

  if (decoded.newEmail) {
    // Update existing user
    user.email = decoded.newEmail.toLowerCase();

    await user.save();

    await EmailVerificationToken.findByIdAndDelete(emailVerificationToken._id);

    const accessToken = generateAccessToken({
      _id: user._id,
      username: user.username,
      email: user.email,
    });

    res
      .status(200)
      .cookie('access-token', accessToken, {
        path: '/',
        maxAge: 5 * 60 * 1000, // 5 min
        domain: process.env.COOKIE_DOMAIN,
      })
      .json({ accessToken });
  } else {
    // Verify new user
    if (user.active) {
      res.status(400);
      throw new Error(
        'This account has already been verified. Try logging in.'
      );
    }

    user.active = true;

    await user.save();

    await EmailVerificationToken.findByIdAndDelete(emailVerificationToken._id);

    res.status(200).json({ message: 'Email succesfully verified!' });
  }
});

export { sendNewEmailVerification, verifyEmail };
