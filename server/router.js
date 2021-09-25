import express from 'express';
import { protect } from './middleware/authMiddleware.js';
import { createList } from './controllers/listController.js';
import { registerUser, loginUser } from './controllers/userController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/users', registerUser);
router.post('/users/login', loginUser);

router.post('/lists', protect, createList);

export default router;
