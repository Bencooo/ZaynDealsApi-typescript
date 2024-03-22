import { Router } from 'express';
import * as SubscriptionController from '../controllers/subscriptionController';
import { checkAuth } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/', SubscriptionController.createSubscription);
router.post('/paymentIntent', checkAuth, SubscriptionController.paymentSheet);
router.delete('/:subId', SubscriptionController.deleteSubscription);
router.get('/', checkAuth, SubscriptionController.getAllSubscriptions);

export default router;
