import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import generateAccessToken from '../utils/generateAccessToken.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

import User from '../models/userModel.js';
import List from '../models/listModel.js';
import RefreshToken from '../models/refreshTokenModel.js';
import EmailVerificationToken from '../models/emailVerificationTokenModel.js';

const usernameRegex = /^(?=[A-Za-z_\d]*[A-Za-z])[A-Za-z_\d]{2,}$/;

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ((!username || !email, !password)) {
    res.status(400);
    throw new Error('Missing fields in request body');
  }

  // Validate username
  if (!username.match(usernameRegex)) {
    res.status(400);
    throw new Error(
      'Invalid username. A username can only contain letters, numbers, and underscores. Must be at least 2 characters long and containt at least one letter.'
    );
  }

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    res.status(409);
    const emailUsername = userExists.email === email ? 'email' : 'username';
    throw new Error(`An account with this ${emailUsername} already exists.`);
  }

  const user = await User.create({
    username,
    email: email.toLowerCase(),
    password,
  });

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

  try {
    // Send email
    await sendVerificationEmail(user.email, emailVerificationToken);
  } catch (err) {
    res.status(400);
    await User.findByIdAndDelete(user._id);
    throw new Error(
      'Could not send verification email to this email address. Try using another email or contact support.'
    );
  }

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
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      domain: process.env.COOKIE_DOMAIN,
    })
    .cookie('access-token', accessToken, {
      path: '/',
      maxAge: 5 * 60 * 1000, // 5 min
      domain: process.env.COOKIE_DOMAIN,
    })
    .json({ accessToken });
});

const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }
  res
    .cookie('refresh-token', '', {
      maxAge: 0,
      domain: process.env.COOKIE_DOMAIN,
    })
    .cookie('access-token', '', {
      maxAge: 0,
      domain: process.env.COOKIE_DOMAIN,
    })
    .sendStatus(204);
});

const updateUser = asyncHandler(async (req, res) => {
  const { newUsername, newPassword } = req.body.updatedValues;
  const user = await User.findById(req.user._id);

  if (newUsername) {
    // Validate username
    if (!newUsername.match(usernameRegex)) {
      res.status(400);
      throw new Error(
        'Invalid username. A username can only contain letters, numbers, and underscores. Must be at least 2 characters long and containt at least one letter.'
      );
    }
    // Update username
    const userExists = await User.findOne({ username: newUsername });
    if (userExists) {
      res.status(409);
      throw new Error('An account with this username already exists.');
    }
    user.username = newUsername;
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
      domain: process.env.COOKIE_DOMAIN,
    })
    .json({ accessToken });
});

const updateEmail = asyncHandler(async (req, res) => {
  const { newEmail } = req.body;
  const user = req.user;

  if (!newEmail) {
    res.status(400);
    throw new Error('No email in request body');
  }

  if (user.email.toLowerCase() === newEmail.toLowerCase()) {
    res.status(400);
    throw new Error('You are already using this email');
  }

  const userExists = await User.findOne({ email: newEmail });
  if (userExists) {
    res.status(409);
    throw new Error('An account with this email already exists.');
  }

  // Delete old verification tokens
  await EmailVerificationToken.deleteMany({ userID: user._id });

  // Generate email verification token
  const emailVerificationToken = jwt.sign(
    { userID: user._id, newEmail },
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

  try {
    // Send email
    await sendVerificationEmail(newEmail, emailVerificationToken);
  } catch (err) {
    res.status(400);
    await EmailVerificationToken.deleteMany({ userID: user._id });
    throw new Error(
      'Could not send verification email to this email address. Try using another email or contact support.'
    );
  }

  res.status(200).json({
    message:
      'An email has been sent to your inbox, please verify the new email address to update your account.',
  });
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

export {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  updateEmail,
  deleteUser,
  getUser,
};
