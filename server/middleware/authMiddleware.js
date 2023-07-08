import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      req.user = decoded;

      const userExists = await User.findById(req.user._id);

      if (!req.user._id || !userExists) {
        res.status(401);
        throw new Error('Unauthorized, could not find user');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Unauthorized, token invalid');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Unauthorized, missing token');
  }
});

export default authenticate;
