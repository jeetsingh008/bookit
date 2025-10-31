import { Router } from 'express';
import { validatePromoCode } from '../controllers/promo.controller.js';

const router = Router();

router.route('/validate')
  .post(validatePromoCode); // POST /promo/validate

export default router;