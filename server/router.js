import express from 'express';
import { authenticate } from './middleware/authMiddleware.js';
import { createList, getLists } from './controllers/listController.js';
import { registerUser, loginUser } from './controllers/userController.js';
import { createAccessToken } from './controllers/tokenController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/users', registerUser);
router.post('/users/login', loginUser);

router.route('/lists').all(authenticate).get(getLists).post(createList);

router.post('/token', createAccessToken);

export default router;
