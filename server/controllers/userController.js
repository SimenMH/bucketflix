import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import generateAccessToken from '../utils/generateAccessToken.js';

import User from '../models/userModel.js';
import RefreshToken from '../models/refreshTokenModel.js';

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    res.status(400);
    throw new Error('Username or email already exists');
  }

  const user = await User.create({ username, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
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
      .json({ accessToken });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export { registerUser, loginUser };
