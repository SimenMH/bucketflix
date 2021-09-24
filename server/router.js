import express from 'express';
import { registerUser } from './controllers/userController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/user', registerUser);

export default router;
