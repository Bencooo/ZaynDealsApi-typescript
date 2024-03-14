import { Router } from 'express';
import * as UsedCouponController from '../controllers/usedCouponController';
import { checkAuth } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/', checkAuth ,UsedCouponController.createUsedCoupon);
router.get('/user/:userId', UsedCouponController.getUsedCouponsByUser);
router.get('/user-merchant', UsedCouponController.getUsedCouponsByUserAndMerchant);

export default router;
