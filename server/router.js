import express from 'express';
import { registerUser, loginUser } from './controllers/userController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/users', registerUser);
router.post('/users/login', loginUser);

export default router;
