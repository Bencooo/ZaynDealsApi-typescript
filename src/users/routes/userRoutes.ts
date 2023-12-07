import { Router } from 'express';
import * as UserController from '../controllers/userController';
import { checkAuth } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/create', UserController.createUser);
router.get('/info', checkAuth, UserController.getUserInfo);

export default router;
