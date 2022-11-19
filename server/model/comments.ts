import z, { ZodError, ZodIssueCode } from 'zod';
import { TMBTI, TEnneagram, TZodiac, IComment, ModelComment } from '../data/comment';
import User from './user';

const commentSchema = z.object({
    uid: z.number(),
    content: z.string().min(1).trim(),
    votes: z.array(
        z.discriminatedUnion('type', [
            z.object({
                type: z.literal('mbti'),
                value: z.nativeEnum(TMBTI),
            }),
            z.object({
                type: z.literal('enneagram'),
                value: z.nativeEnum(TEnneagram),
            }),
            z.object({
                type: z.literal('zodiac'),
                value: z.nativeEnum(TZodiac),
            }),
        ])
    ).max(3, 'You cannot vote more than 3 personalities traits.').optional(),
});
type CreateCommentOptions = z.infer<typeof commentSchema>;

export default class Comment {
    
    public constructor(
        private readonly User: User,
    ) {}    
    private checkUserExists(uid: number): Promise<boolean> {
        return this.User.checkUserExists(uid);
    }
    public async createComment(opt: CreateCommentOptions): Promise<IComment | z.ZodError> {
        const safeOpt = commentSchema.safeParse(opt);
        if(!safeOpt.success) {
            return safeOpt.error;
        }
        const { content, votes, uid } = safeOpt.data;
        const isUserExists = await this.checkUserExists(uid);
        if(!isUserExists) {
            return new ZodError([
                {
                    code: ZodIssueCode.custom,
                    path: ['uid'],
                    message: 'User does not exist.',

                }
            ]);
        }

        const comment = new ModelComment({
            content,
            votes,
            owner_id: uid,
        });
        const newComment = await comment.save();
        return newComment;
    }
    public async getCommentsByUserId(uid: number): Promise<IComment[]> {
        const comments = ModelComment.find({}).where('owner_id').equals(uid);
        return comments;
    }
}