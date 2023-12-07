import { Router } from 'express';
import * as SubscriptionController from '../controllers/subscriptionController';

const router = Router();

router.post('/', SubscriptionController.createSubscription);
router.delete('/:subId', SubscriptionController.deleteSubscription);
router.get('/', SubscriptionController.getAllSubscriptions);

export default router;
