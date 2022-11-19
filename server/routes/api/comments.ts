import express from 'express';
import { ZodError } from 'zod';
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

export default router;