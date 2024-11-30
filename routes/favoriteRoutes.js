import { Router } from 'express';
import { addFavorite, removeFavorite, getUserFavorites } from '../controllers/favoriteController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post('/add', protect, addFavorite);
router.delete('/remove', protect, removeFavorite);
router.get('/:userId', protect, getUserFavorites);


export default router;
