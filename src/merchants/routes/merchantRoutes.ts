import { Router } from 'express';
import * as MerchantController from '../controllers/merchantController';
import { checkAuth } from '../../middlewares/authMiddleware';

const router = Router();

//router.post('/create', MerchantController.createMerchant);
router.post('/create', MerchantController.createMerchantAndAddress);
router.delete('/:merchantId', MerchantController.deleteMerchant);
router.get('/foods', MerchantController.getAllFoodMerchants);
router.put('/:merchantId', MerchantController.updateMerchant);
router.get('/search', MerchantController.getMerchantByName);
router.get('', MerchantController.getMerchantCategory);

export default router;
