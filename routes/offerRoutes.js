import express from 'express';
import { createOffers } from '../controllers/offerController.js';

const router = express.Router();

router.post('/offer', createOffers);

export default router;