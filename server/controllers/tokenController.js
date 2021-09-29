import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import generateAccessToken from '../utils/generateAccessToken.js';

import User from '../models/userModel.js';
import RefreshToken from '../models/refreshTokenModel.js';

const createAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies['refresh-token'];
  if (refreshToken == null) return res.sendStatus(401);

  const tokenExists = await RefreshToken.findOne({ token: refreshToken });
  if (!tokenExists) return res.sendStatus(403);

  const dateNow = new Date();
  const elapsedTimeSinceUse = (dateNow - tokenExists.last_used) / 1000;
  if (elapsedTimeSinceUse > 2.628e6) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, { user_id }) => {
      if (err) return res.sendStatus(403);

      const user = await User.findById(user_id);
      const accessToken = generateAccessToken({
        _id: user._id,
        username: user.username,
        email: user.email,
      });

      res.status(201).json({ accessToken });

      tokenExists.last_used = new Date();
      await tokenExists.save();
    }
  );
});

export { createAccessToken };
