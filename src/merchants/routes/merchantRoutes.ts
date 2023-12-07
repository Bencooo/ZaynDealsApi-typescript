import { Router } from 'express';
import * as MerchantController from '../controllers/merchantController';

const router = Router();

router.post('/create', MerchantController.createMerchant);
router.delete('/:merchantId', MerchantController.deleteMerchant);
router.get('/foods', MerchantController.getAllFoodMerchants);
router.put('/:merchantId', MerchantController.updateMerchant);

export default router;
