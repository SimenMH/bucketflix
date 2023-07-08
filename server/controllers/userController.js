import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import generateAccessToken from '../utils/generateAccessToken.js';

import User from '../models/userModel.js';
import List from '../models/listModel.js';
import RefreshToken from '../models/refreshTokenModel.js';

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

  try {
    const user = await User.create({ username, email, password });

    if (user) {
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
        .status(201)
        .cookie('refresh-token', refreshToken, {
          path: '/',
          httpOnly: true,
          maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
          // secure: true,
        })
        .cookie('access-token', accessToken, {
          path: '/',
          maxAge: 5 * 60 * 1000, // 5 min
        })
        .json({ accessToken });
    } else {
      throw new Error('Invalid user data');
    }
  } catch (err) {
    res.status(400);
    throw new Error(err);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
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
        // secure: true,
      })
      .cookie('access-token', accessToken, {
        path: '/',
        maxAge: 5 * 60 * 1000, // 5 min
      })
      .json({ accessToken });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
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
      throw new Error(`An account with this username already exists.`);
    }
    user.username = newUsername;
  }

  if (newEmail) {
    // Update email
    const userExists = await User.findOne({ email: newEmail });
    if (userExists) {
      res.status(409);
      throw new Error(`An account with this email already exists.`);
    }
    user.email = newEmail;
  }

  if (newPassword) {
    // Update password
    user.password = newPassword;
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
