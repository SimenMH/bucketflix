import express from 'express';
import authenticate from './middleware/authMiddleware.js';
import isListOwner from './middleware/isListOwnerMiddleware.js';
import canEditList from './middleware/canEditListMiddleware.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
} from './controllers/userController.js';
import {
  getLists,
  createList,
  editList,
  deleteList,
  addSharedUser,
  editSharedUser,
  removeSharedUser,
} from './controllers/listController.js';
import {
  addMedia,
  editMedia,
  deleteMedia,
} from './controllers/mediaController.js';
import { createInvite } from './controllers/listInviteController.js';
import { createAccessToken } from './controllers/tokenController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello world');
});

router.get('/users/:username', getUser);
router.post('/users', registerUser);
router.post('/users/login', loginUser);
router.post('/users/logout', logoutUser);

router
  .route('/lists')
  .all(authenticate)
  .get(getLists)
  .post(createList)
  .all(isListOwner)
  .put(editList)
  .delete(deleteList);

router
  .route('/lists/media')
  .all(authenticate, canEditList)
  .post(addMedia)
  .put(editMedia)
  .delete(deleteMedia);

router
  .route('/lists/users')
  .all(authenticate)
  .post(addSharedUser)
  .all(isListOwner)
  .put(editSharedUser)
  .delete(removeSharedUser);
router.route('/lists/invite').all(authenticate, isListOwner).post(createInvite);

router.post('/token', createAccessToken);

export default router;
