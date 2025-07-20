// routes/discount.js
import express from 'express';
import { getHighestDiscount } from '../controllers/discountController.js';

const router = express.Router();

router.get("/highest-discount", getHighestDiscount);

export default router;