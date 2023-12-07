import { Router } from 'express';
import * as UsedCouponController from '../controllers/usedCouponController';

const router = Router();

router.post('/', UsedCouponController.createUsedCoupon);
router.get('/user/:userId', UsedCouponController.getUsedCouponsByUser);
router.get('/user-merchant', UsedCouponController.getUsedCouponsByUserAndMerchant);

export default router;
