import express from 'express';
import { z, ZodError } from 'zod';
import Comment from '../../model/comments';
import User from '../../model/user';
import { TPersonalitySystem } from '../../data/comment';
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

router.post('/likes/:commentId', async function(req, res) {
    const user = new User();
    const comment = new Comment(
        user,
    );
    const commentIdSchema = z.string();
    const commentId = commentIdSchema.safeParse(req.params.commentId);
    const payloadSchema = z.object({
        uid: z.number(),
    });
    if(!commentId.success) {
        return res.status(400).json(commentId.error);
    }
    const payload = payloadSchema.safeParse(req.body);
    if(!payload.success) {
        return res.status(400).json(payload.error);
    }
    const newLike = await comment.likeAComment(commentId.data, payload.data.uid);
    if(newLike instanceof ZodError) {
        return res.status(400).json(newLike);
    }
    return res.json(newLike);
});

router.get('/likes/:commentId', async function(req, res) {
    const user = new User();
    const comment = new Comment(
        user,
    );
    const commentIdSchema = z.string();
    const commentId = commentIdSchema.safeParse(req.params.commentId);
    if(!commentId.success) {
        return res.status(400).json(commentId.error);
    }
    const likes = await comment.getLikesByCommentId(commentId.data);
    if(likes instanceof ZodError) {
        return res.status(400).json(likes);
    }
    return res.json(likes);
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


router.get('/', async function(req, res) {
    const user = new User();
    const comment = new Comment(
        user,
    );
    const filterSchema = z.nativeEnum(TPersonalitySystem).optional();
    const sortingSchema = z.enum([
        'recent',
        'best',
    ]).optional();
    
    const filter = filterSchema.safeParse(req.query.filter);
    const sorting = sortingSchema.safeParse(req.query.sorting);
    
    if(!filter.success) {
        return res.status(400).json(filter.error);
    }
    if(!sorting.success) {
        return res.status(400).json(sorting.error);
    }
    
    const listOfComments = await comment.getComments({
        filter: filter.data,
        sorting: sorting.data,
    });
    return res.status(200).json(listOfComments);
});

export default router;