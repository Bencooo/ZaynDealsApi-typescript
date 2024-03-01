import { Router } from 'express';
import { checkAuth } from '../../middlewares/authMiddleware';
import * as MerchantController from '../controllers/merchantController';

const router = Router();

router.post('/create', MerchantController.createMerchant);
router.get('/:merchantId', checkAuth, MerchantController.getMerchantById);
router.get('', MerchantController.getMerchantCategory);

//router.delete('/:merchantId', MerchantController.deleteMerchant);
//router.get('/foods', MerchantController.getAllFoodMerchants);
//router.put('/:merchantId', MerchantController.updateMerchant);
//router.get('/search', MerchantController.getMerchantByName);

export default router;
