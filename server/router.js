import express from 'express';
import { protect } from './middleware/authMiddleware.js';
import { createList, getLists } from './controllers/listController.js';
import { registerUser, loginUser } from './controllers/userController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/users', registerUser);
router.post('/users/login', loginUser);

router.route('/lists').all(protect).get(getLists).post(createList);

export default router;
