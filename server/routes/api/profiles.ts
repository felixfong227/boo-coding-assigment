import express from 'express';
import { ZodError } from 'zod';
import User from '../../model/user';
const router = express.Router();

router.post('/', async function(req, res) {
    const user = new User();
    const newUser = await user.createUser({
        ...req.body,
    });
    if(newUser instanceof ZodError) {
        console.error(newUser);
        return res.status(400).json(newUser.issues);
    }
    return res.status(201).json(newUser);
});

export default router;