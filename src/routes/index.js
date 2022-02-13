import express from 'express';
import ArticlesController from '../controllers/ArticlesController.js';

const router = express.Router();

router.get('/', (req, res) => res.send('Kumparan Skill Test'));
router.post('/articles', ArticlesController.createValidation, ArticlesController.create);
router.get('/articles', ArticlesController.getAll);

export default router;