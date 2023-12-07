import { Router } from 'express';
import * as CouponController from '../controllers/couponController';

const router = Router();

router.post('/', CouponController.createCoupon);
router.get('/merchant/:merchantId', CouponController.getAllCouponByMerchant);
router.put('/:couponId', CouponController.updateCoupon);

export default router;
