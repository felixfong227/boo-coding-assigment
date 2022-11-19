import express from 'express';
import { z, ZodError } from 'zod';
import Comment from '../../model/comments';
import User from '../../model/user';
const router = express.Router();

router.post('/', async function(req, res) {
    const user = new User();
    const comment = new Comment(
        user,
    );
    const newComment = await comment.createComment({
        ...req.body,
    });
    if(newComment instanceof ZodError) {
        return res.status(400).json(newComment);
    }
    return res.status(201).json(newComment);
});

router.get('/:uid', async function(req, res) {
    const user = new User();
    const comment = new Comment(
        user,
    );
    const uidSchema = z.number().positive();
    const uid = uidSchema.safeParse(
        parseInt(req.params.uid)
    );
    if(!uid.success) {
        res.status(400).send(uid.error.message);
        return;
    }
    const isUserExists = await user.checkUserExists(uid.data);
    if(!isUserExists) {
        res.status(404).send('User not found');
        return;
    }
    const commentsBelongToUser = await comment.getCommentsByUserId(uid.data);
    return res.status(200).json(commentsBelongToUser);
});

export default router;