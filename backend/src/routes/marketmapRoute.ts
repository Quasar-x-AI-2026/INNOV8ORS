import express from 'express';
import { getMarketMapData } from '../controllers/marketmapController';

const router = express.Router();


router.get('/map-view', getMarketMapData);

export default router;