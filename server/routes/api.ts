import express from 'express';
const router = express.Router();
import profileRouter from './api/profiles';

router.use('/profiles', profileRouter);

export default router;