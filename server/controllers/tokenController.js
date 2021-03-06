import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import generateAccessToken from '../utils/generateAccessToken.js';

import User from '../models/userModel.js';
import RefreshToken from '../models/refreshTokenModel.js';

const createAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies['refresh-token'];
  if (refreshToken == null) return res.sendStatus(403);

  const tokenExists = await RefreshToken.findOne({ token: refreshToken });
  if (!tokenExists) {
    return res
      .cookie('refresh-token', '', {
        maxAge: 0,
      })
      .sendStatus(403);
  }

  const dateNow = new Date();
  const elapsedTimeSinceUse = (dateNow - tokenExists.last_used) / 1000;
  // If time since use is greater than 1 year
  if (elapsedTimeSinceUse > 365 * 24 * 60 * 60 * 1000) {
    return res
      .cookie('refresh-token', '', {
        maxAge: 0,
      })
      .sendStatus(403);
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, { user_id }) => {
      if (err) {
        return res
          .cookie('refresh-token', '', {
            maxAge: 0,
          })
          .sendStatus(403);
      }

      const user = await User.findById(user_id);
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

      tokenExists.last_used = new Date();
      await tokenExists.save();
    }
  );
});

export { createAccessToken };
