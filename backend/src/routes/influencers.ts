import { Router } from 'express';
import { searchInfluencers, getInfluencerById } from '../controllers/influencerController';

const router = Router();

// GET /api/influencers - Search with filters
router.get('/', searchInfluencers);

// GET /api/influencers/:id - Get single influencer details
router.get('/:id', getInfluencerById);

export default router;
