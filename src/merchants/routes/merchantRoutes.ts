import { Router } from 'express';
import * as MerchantController from '../controllers/merchantController';

const router = Router();

router.post('/create', MerchantController.createMerchant);
router.post('/createAddress', MerchantController.createMerchantAndAddress);
router.delete('/:merchantId', MerchantController.deleteMerchant);
router.get('/foods', MerchantController.getAllFoodMerchants);
router.put('/:merchantId', MerchantController.updateMerchant);

router.get('/category', MerchantController.getMerchantCategory);

export default router;
