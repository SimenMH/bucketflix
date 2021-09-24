import express from 'express';
import { createUser } from './controllers/userController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/user', createUser);

export default router;
