import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import generateAccessToken from '../utils/generateAccessToken.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

import User from '../models/userModel.js';
import List from '../models/listModel.js';
import RefreshToken from '../models/refreshTokenModel.js';
import EmailVerificationToken from '../models/emailVerificationTokenModel.js';

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    res.status(409);
    const emailUsername = userExists.email === email ? 'email' : 'username';
    throw new Error(`An account with this ${emailUsername} already exists.`);
  }

  const user = await User.create({ username, email, password });

  if (!user) {
    res.status(400);
    throw new Error('Invalid user data');
  }

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
      'New user successfully created. An email has been sent to your inbox, please verify your email to complete the registration.',
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Incorrect password or email');
  }

  if (!user.active) {
    res.status(400);
    throw new Error('Please verify your email before signing in.');
  }

  const refreshToken = jwt.sign(
    { user_id: user._id },
    process.env.REFRESH_TOKEN_SECRET
  );

  await RefreshToken.create({
    user_id: user._id,
    token: refreshToken,
    last_used: new Date(),
  });

  const accessToken = generateAccessToken({
    _id: user._id,
    username: user.username,
    email: user.email,
  });

  res
    .status(200)
    .cookie('refresh-token', refreshToken, {
      path: '/',
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    })
    .cookie('access-token', accessToken, {
      path: '/',
      maxAge: 5 * 60 * 1000, // 5 min
    })
    .json({ accessToken });
});

const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies['refresh-token'];

  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }
  res
    .cookie('refresh-token', '', {
      maxAge: 0,
    })
    .cookie('access-token', '', {
      maxAge: 0,
    })
    .sendStatus(204);
});

const updateUser = asyncHandler(async (req, res) => {
  const { newUsername, newEmail, newPassword } = req.body.updatedValues;
  const user = await User.findById(req.user._id);

  if (newUsername) {
    // Update username
    const userExists = await User.findOne({ username: newUsername });
    if (userExists) {
      res.status(409);
      throw new Error('An account with this username already exists.');
    }
    user.username = newUsername;
  }

  if (newEmail) {
    // Update email
    const userExists = await User.findOne({ email: newEmail });
    if (userExists) {
      res.status(409);
      throw new Error('An account with this email already exists.');
    }
    user.email = newEmail;
  }

  if (newPassword) {
    // Update password
    if (await user.matchPassword(newPassword.currentPassword)) {
      user.password = newPassword.newPassword;
    } else {
      throw new Error('Incorrect password');
    }
  }

  await user.save();

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
    })
    .json({ accessToken });
});

const deleteUser = asyncHandler(async (req, res) => {
  const userID = req.user._id;
  const { password } = req.body;

  const user = await User.findById(userID);

  if (!password) throw new Error('Missing password in body');

  if (await user.matchPassword(password)) {
    await User.deleteOne({ _id: userID });
    await List.deleteMany({ user_id: userID });

    const sharedLists = await List.find({
      'sharedUsers.user_id': userID,
    });

    for (const list of sharedLists) {
      const idx = list.sharedUsers.findIndex(
        el => el.user_id.toString() === userID
      );

      if (idx > -1) {
        list.sharedUsers.splice(idx, 1);
      }
    }
    await List.bulkSave(sharedLists);

    res.sendStatus(204);
  } else {
    throw new Error('Incorrect password');
  }
});

const getUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    res.status(404);
    throw new Error(`Could not find user ${username}`);
  }
  res.status(200).json({ user_id: user._id, username: user.username });
});

export { registerUser, loginUser, logoutUser, updateUser, deleteUser, getUser };
