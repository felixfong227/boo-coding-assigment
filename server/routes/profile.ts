'use strict';

import express from 'express';
import { z } from 'zod';
import User from '../model/user';
import apiRouter from './api';
const router = express.Router();

router.get('/:id', async function(req, res) {
    const uidSchema = z.number().positive();
    const uid = uidSchema.safeParse(
        parseInt(req.params.id)
    );
    if(!uid.success) {
        res.status(400).send(uid.error.message);
        return;
    }
    const user = new User();
    const profile = await user.getUserById(uid.data);
    if(!profile) {
        res.status(404).send('User not found');
        return;
    }
    res.render('profile_template', {
        profile,
    });
});

router.use('/api', apiRouter);

export default router;