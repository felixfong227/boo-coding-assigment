import express from 'express';
const router = express.Router();
import profileRouter from './api/profiles';
import commentsRouter from './api/comments';

router.use('/profiles', profileRouter);

router.use('/comments', commentsRouter);

export default router;