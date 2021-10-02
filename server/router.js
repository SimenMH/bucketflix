import express from 'express';
import { authenticate } from './middleware/authMiddleware.js';
import { registerUser, loginUser } from './controllers/userController.js';
import {
  getLists,
  createList,
  editList,
  deleteList,
} from './controllers/listController.js';
import {
  addMedia,
  editMedia,
  deleteMedia,
} from './controllers/mediaController.js';
import { createAccessToken } from './controllers/tokenController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/users', registerUser);
router.post('/users/login', loginUser);

router
  .route('/lists')
  .all(authenticate)
  .get(getLists)
  .post(createList)
  .put(editList)
  .delete(deleteList);
router
  .route('/lists/media')
  .all(authenticate)
  .post(addMedia)
  .put(editMedia)
  .delete(deleteMedia);

router.post('/token', createAccessToken);

export default router;
