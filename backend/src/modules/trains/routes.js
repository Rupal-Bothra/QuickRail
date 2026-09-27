import { Router } from 'express';
import { searchTrains, getTrainById, getStations } from './controller.js';

const router = Router();

router.get('/search', searchTrains);
router.get('/stations', getStations);
router.get('/:id', getTrainById);

export default router;
