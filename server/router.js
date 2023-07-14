import express from 'express';
import authenticate from './middleware/authMiddleware.js';
import isListOwner from './middleware/isListOwnerMiddleware.js';
import canEditList from './middleware/canEditListMiddleware.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  updateEmail,
} from './controllers/userController.js';
import {
  getLists,
  createList,
  editList,
  deleteList,
  addSharedUser,
  editSharedUser,
  removeSharedUser,
  leaveSharedList,
} from './controllers/listController.js';
import {
  addMedia,
  editMedia,
  deleteMedia,
} from './controllers/mediaController.js';
import { createInvite, getInvite } from './controllers/listInviteController.js';
import { createAccessToken } from './controllers/tokenController.js';
import validateInviteCode from './middleware/validateInviteCodeMiddleware.js';
import {
  sendNewEmailVerification,
  verifyEmail,
} from './controllers/emailVerificationController.js';
import {
  sendPasswordReset,
  updatePassword,
} from './controllers/resetPasswordController.js';
import {
  searchForMedia,
  searchForMediaById,
} from './controllers/searchMediaController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello world');
});

router
  .route('/users')
  .post(registerUser)
  .all(authenticate)
  .put(updateUser)
  .delete(deleteUser);
router.post('/users/login', loginUser);
router.post('/users/logout', logoutUser);
router.get('/users/:username', getUser);
router
  .route('/users/verify-email')
  .post(sendNewEmailVerification)
  .put(verifyEmail);
router.route('/users/update-email').post(authenticate, updateEmail);
router
  .route('/users/reset-password')
  .post(sendPasswordReset)
  .put(updatePassword);

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
  .post(validateInviteCode, addSharedUser)
  .delete(removeSharedUser)
  .all(isListOwner)
  .put(editSharedUser);

router.route('/lists/leave').all(authenticate).delete(leaveSharedList);

router
  .route('/lists/invite')
  .all(authenticate)
  .get(validateInviteCode, getInvite)
  .post(isListOwner, createInvite);

router.post('/token', createAccessToken);

router.route('/media').get(authenticate, searchForMedia);
router.route('/media/:mediaID').get(authenticate, searchForMediaById);

export default router;
