import { Router } from 'express';
import * as UserSubscriptionController from '../controllers/userSubscriptionController';

const router = Router();

router.post('', UserSubscriptionController.createUserSubscription);

export default router;
