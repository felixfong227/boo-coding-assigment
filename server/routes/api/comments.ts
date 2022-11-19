import express from 'express';
import { ZodError } from 'zod';
import Comment from '../../model/comments';
const router = express.Router();

router.post('/', async function(req, res) {
    const comment = new Comment();
    const newComment = await comment.createComment({
        ...req.body,
    });
    if(newComment instanceof ZodError) {
        return res.status(400).json(newComment);
    }
    return res.status(201).json(newComment);
});

export default router;