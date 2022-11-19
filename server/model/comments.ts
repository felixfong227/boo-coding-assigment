import { PipelineStage } from 'mongoose';
import z, { ZodError, ZodIssueCode } from 'zod';
import { TMBTI, TEnneagram, TZodiac, IComment, ModelComment, ILike, TPersonalitySystem } from '../data/comment';
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

type GetCommentsByUserIdOptions = {
    filter?: TPersonalitySystem;
    sorting?: 'best' | 'recent';
    limit?: number;
}

export default class Comment {
    
    public constructor(
        private readonly User: User,
    ) {}    
    public async createComment(opt: CreateCommentOptions): Promise<IComment | ZodError> {
        const safeOpt = commentSchema.safeParse(opt);
        if(!safeOpt.success) {
            return safeOpt.error;
        }
        const { content, votes, uid } = safeOpt.data;
        const owner = await this.User.getUserById(uid);
        if(!owner) {
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
            owner_profile: owner._id,
        });
        const newComment = await comment.save();
        return newComment;
    }
    public async getComments(arg: GetCommentsByUserIdOptions): Promise<IComment[]> {
        const { filter, sorting, limit = 10 } = arg;

        const aggreatePipeline: PipelineStage[] = [];
        
        if(filter) {
            // sort by personality system, e.g. mbti, enneagram, zodiac
            aggreatePipeline.push({
                $match: {
                    votes: {
                        $elemMatch: {
                            type: filter,
                        }
                    }
                }
            });
        }
        if(sorting) {
            switch (sorting) {
            case 'best': {
                // sort by most likes
                aggreatePipeline.push({
                    $sort: {
                        'likes': -1,
                    }
                });
                break;
            }
            case 'recent': {
                // sort by most recent
                aggreatePipeline.push({
                    $sort: {
                        'creation_date': -1,
                    }
                });
                break;
            }
            }
        }
        
        // default sorting is by most recent with all categories
        if(aggreatePipeline.length < 0) {
            aggreatePipeline.push({
                $sort: {
                    'creation_date': -1,
                }
            });
        }
        
        const comments = await ModelComment.aggregate(aggreatePipeline).limit(limit);
        
        return comments;
        
    }
    public async getCommentsByUserId(uid: number): Promise<IComment[]> {
        const comments = ModelComment.find()
            .where('owner_id')
            .equals(uid)
            .populate('owner_profile');
        return comments;
    }
    public async likeAComment(commentId: string, uid: number): Promise<ILike | ZodError> {
        const owner = await this.User.getUserById(uid);
        if(!owner) {
            return new ZodError([
                {
                    code: ZodIssueCode.custom,
                    path: ['uid'],
                    message: 'User does not exist.',
                }
            ]);
        }
        const comment = new ModelComment({
            _id: commentId,
        });
        await comment.updateOne({
            $push: {
                likes: {
                    owner_id: uid,
                    owner_profile: owner,
                }
            }
        });
        return {
            creation_time: Date.now(),
            liked_by_owner_id: uid,
            liked_by_owner_profile: owner,
        };
    }
    public async getLikesByCommentId(commentId: string): Promise<ILike[] | null> {
        const likes = await ModelComment.findOne<ILike[]>({
            _id: commentId,
        }, 'likes');
        return likes;
    }
}