import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { ModelComment, TPersonalitySystem } from '../../data/comment';
import { ModelUser } from '../../data/user';
import Comment from '../../model/comments';
import User from '../../model/user';
import { mongoDB } from '../../utils/db';

async function setup() {
    const db = await mongoDB();
    const dbUrl = db.getUri();
    await mongoose.connect(dbUrl);
    
    // seed the db
    const dummyUser1 = await new ModelUser({
        'id': 1,
        'name': 'A Martinez',
        'description': 'Adolph Larrue Martinez III.',
        'mbti': 'ISFJ',
        'enneagram': '9w3',
        'variant': 'sp/so',
        'tritype': 725,
        'socionics': 'SEE',
        'sloan': 'RCOEN',
        'psyche': 'FEVL',
        'image': 'http://placekitten.com/200/200',
    }).save();
    
    const dummyUser2 = await new ModelUser({
        'id': 2,
        'name': 'B Martinez',
        'description': 'Bdolph Larrue Martinez III.',
        'mbti': 'ISFJ',
        'enneagram': '9w3',
        'variant': 'sp/so',
        'tritype': 725,
        'socionics': 'SEE',
        'sloan': 'RCOEN',
        'psyche': 'FEVL',
        'image': 'http://placekitten.com/200/200',
    }).save();
    
    const dummyComment1 = await new ModelComment({
        content: 'Dummy comment 1',
        creation_date: 123,
        owner_id: 1,
        owner_profile: dummyUser1._id,
    }).save();

    const dummyComment2 = await new ModelComment({
        content: 'Dummy comment 2',
        creation_date: 124,
        owner_id: 2,
        owner_profile: dummyUser2._id,
        likes: [
            {
                creation_time: Date.now(),
                liked_by_owner_id: 1,
                liked_by_owner_profile: dummyUser1._id,
            },
            {
                creation_time: Date.now(),
                liked_by_owner_id: 1,
                liked_by_owner_profile: dummyUser1._id,
            },
            {
                creation_time: Date.now(),
                liked_by_owner_id: 1,
                liked_by_owner_profile: dummyUser1._id,
            },
            {
                creation_time: Date.now(),
                liked_by_owner_id: 1,
                liked_by_owner_profile: dummyUser1._id,
            },
        ],
        votes: [
            {
                type: 'mbti',
                value: 'ISFJ',
            },
            {
                type: 'mbti',
                value: 'ENTJ',
            }
        ]
    }).save();

    const dummyComment3 = await new ModelComment({
        content: 'Dummy comment 3',
        creation_date: 110,
        owner_id: 2,
        owner_profile: dummyUser2._id,
        likes: [
            {
                creation_time: Date.now(),
                liked_by_owner_id: 1,
                liked_by_owner_profile: dummyUser1._id,
            },
            {
                creation_time: Date.now(),
                liked_by_owner_id: 1,
                liked_by_owner_profile: dummyUser1._id,
            },
            {
                creation_time: Date.now(),
                liked_by_owner_id: 1,
                liked_by_owner_profile: dummyUser1._id,
            },
            {
                creation_time: Date.now(),
                liked_by_owner_id: 1,
                liked_by_owner_profile: dummyUser1._id,
            },
            {
                creation_time: Date.now(),
                liked_by_owner_id: 1,
                liked_by_owner_profile: dummyUser1._id,
            },
            
        ],
        votes: [
            {
                type: 'enneagram',
                value: '1w2',
            },
            {
                type: 'enneagram',
                value: '2w3',
            }
        ]
    }).save();
    
    return {
        db,
        dummyUser1,
        dummyUser2,
        dummyComment1,
        dummyComment2,
        dummyComment3,
    };
}

jest.setTimeout(30 * 1000);

describe('Get a list of comments', () => {
    
    const user = new User();
    
    test('should return a list of comments without any inputs', async () => {
        const { dummyUser1, dummyUser2, db } = await setup();
        const comment = await new Comment(user).getComments({});
        expect(comment).toMatchObject([
            {
                __v: 0,
                _id: expect.anything(),
                content: 'Dummy comment 2',
                creation_date: expect.anything(),
                owner_id: 2,
                owner_profile: dummyUser2._id,
                likes: [
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },

                ],
                votes: [
                    {
                        type: 'mbti',
                        value: 'ISFJ',
                    },
                    {
                        type: 'mbti',
                        value: 'ENTJ',
                    }

                ],
            },
            {
                __v: 0,
                _id: expect.anything(),
                content: 'Dummy comment 1',
                creation_date: expect.anything(),
                owner_id: 1,
                owner_profile: dummyUser1._id,
                likes: [],
                votes: []
            },
            {
                __v: 0,
                _id: expect.anything(),
                content: 'Dummy comment 3',
                creation_date: expect.anything(),
                owner_id: 2,
                owner_profile: dummyUser2._id,
                likes: [
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                ],
                votes: [
                    {
                        type: 'enneagram',
                        value: '1w2',
                    },
                    {
                        type: 'enneagram',
                        value: '2w3',
                    }

                ],
            },
        ]);
        await mongoose.disconnect();
        await db.stop();
    });
    
    test('should return a list of comments sortted by most recent posted when "sorting" is set to "recent"', async () => {
        const { dummyUser1, dummyUser2, db } = await setup();
        const comment = await new Comment(user).getComments({});
        expect(comment).toMatchObject([
            {
                __v: 0,
                _id: expect.anything(),
                content: 'Dummy comment 2',
                creation_date: expect.anything(),
                owner_id: 2,
                owner_profile: dummyUser2._id,
                likes: [
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },

                ],
                votes: [
                    {
                        type: 'mbti',
                        value: 'ISFJ',
                    },
                    {
                        type: 'mbti',
                        value: 'ENTJ',
                    }

                ],
            },
            {
                __v: 0,
                _id: expect.anything(),
                content: 'Dummy comment 1',
                creation_date: expect.anything(),
                owner_id: 1,
                owner_profile: dummyUser1._id,
                likes: [],
                votes: []
            },
            {
                __v: 0,
                _id: expect.anything(),
                content: 'Dummy comment 3',
                creation_date: expect.anything(),
                owner_id: 2,
                owner_profile: dummyUser2._id,
                likes: [
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                ],
                votes: [
                    {
                        type: 'enneagram',
                        value: '1w2',
                    },
                    {
                        type: 'enneagram',
                        value: '2w3',
                    }

                ],
            },
        ]);
        await mongoose.disconnect();
        await db.stop();
    });
    
    test('should return a list of comments sortted by most liked post when "sorting" is set to "best"', async () => {
        const { dummyUser1, dummyUser2, db } = await setup();
        const comment = await new Comment(user).getComments({
            sorting: 'best',
        });
        expect(comment).toMatchObject([
            {
                __v: 0,
                _id: expect.anything(),
                content: 'Dummy comment 3',
                creation_date: expect.anything(),
                owner_id: 2,
                owner_profile: dummyUser2._id,
                likes: [
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                ],
                votes: [
                    {
                        type: 'enneagram',
                        value: '1w2',
                    },
                    {
                        type: 'enneagram',
                        value: '2w3',
                    }

                ],
            },
            {
                __v: 0,
                _id: expect.anything(),
                content: 'Dummy comment 2',
                creation_date: expect.anything(),
                owner_id: 2,
                owner_profile: dummyUser2._id,
                likes: [
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },

                ],
                votes: [
                    {
                        type: 'mbti',
                        value: 'ISFJ',
                    },
                    {
                        type: 'mbti',
                        value: 'ENTJ',
                    }

                ],
            },
            {
                __v: 0,
                _id: expect.anything(),
                content: 'Dummy comment 1',
                creation_date: expect.anything(),
                owner_id: 1,
                owner_profile: dummyUser1._id,
                likes: [],
                votes: []
            }
        ]);
        await mongoose.disconnect();
        await db.stop();
    });
    
    test('should return a list of comments when filter set to "enneagram"', async () => {
        const { dummyUser1, dummyUser2, db } = await setup();
        const comment = await new Comment(user).getComments({
            filter: 'enneagram' as TPersonalitySystem,
        });
        expect(comment).toMatchObject([
            {
                __v: 0,
                _id: expect.anything(),
                content: 'Dummy comment 3',
                creation_date: expect.anything(),
                owner_id: 2,
                owner_profile: dummyUser2._id,
                likes: [
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                    {
                        _id: expect.anything(),
                        creation_time: expect.anything(),
                        liked_by_owner_id: 1,
                        liked_by_owner_profile: dummyUser1._id,
                    },
                ],
                votes: [
                    {
                        type: 'enneagram',
                        value: '1w2',
                    },
                    {
                        type: 'enneagram',
                        value: '2w3',
                    }

                ],
            },
        ]);
        await mongoose.disconnect();
        await db.stop();
    });
    
    test('should return empty array when "sorting" is not set to "best" or "recent"', async () => {
        const { db } = await setup();
        const comment = new Comment(user);
        const comments = await comment.getComments({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            sorting: 'wrong data',
        });
        expect(comments).toBeInstanceOf(ZodError);
        await mongoose.disconnect();
        await db.stop();
    });

});

describe('Comment liking', () => {

    const user = new User();
    
    test('should return IComment, likeing a normal comment', async () => {
        const { db, dummyComment1, dummyUser1 } = await setup();
        const comment = new Comment(user);
        const likedComment = await comment.likeAComment(dummyComment1._id.toString(), dummyUser1.id);
        expect(likedComment).toMatchObject({
            creation_time: expect.anything(),
            liked_by_owner_id: dummyUser1.id,
            liked_by_owner_profile: {
                __v: 0,
                _id: expect.anything(),
                creation_date: expect.anything(),
                id: 1,
                name: 'A Martinez',
                description: 'Adolph Larrue Martinez III.',
                mbti: 'ISFJ',
                enneagram: '9w3',
                variant: 'sp/so',
                tritype: 725,
                socionics: 'SEE',
                sloan: 'RCOEN',
                psyche: 'FEVL',
                image: 'http://placekitten.com/200/200',
            },
        });
        await mongoose.disconnect();
        await db.stop();
    });
    
    test('should return ZodError, incorrect user id', async () => {
        const { db, dummyComment1 } = await setup();
        const comment = new Comment(user);
        const likedComment = await comment.likeAComment(dummyComment1._id.toString(), 999);
        expect(likedComment).toBeInstanceOf(ZodError);
        await mongoose.disconnect();
        await db.stop();
    });

});

describe('Create comment', () => {
    const user = new User();
    
    test('should return IComment, creating a normal comment with no votes', async () => {
        const { db, dummyUser1 } = await setup();
        const comment = new Comment(user);
        const createdComment = await comment.createComment({
            content: 'Dummy comment 4',
            uid: dummyUser1.id,
        });
        expect(createdComment).toMatchObject({
            __v: 0,
            _id: expect.anything(),
            content: 'Dummy comment 4',
            creation_date: expect.anything(),
            owner_id: dummyUser1.id,
            owner_profile: expect.anything(),
            likes: [],
            votes: [],
        });
        await mongoose.disconnect();
        await db.stop();
    });

    test('should return ZodError, creating comment with unknown user ID', async () => {
        const { db } = await setup();
        const comment = new Comment(user);
        const createdComment = await comment.createComment({
            content: 'dummy',
            uid: 999,
        });
        expect(createdComment).toBeInstanceOf(ZodError);
        await mongoose.disconnect();
        await db.stop();
    });
    
});

describe('Get comment by user ID', () => {
    const user = new User();

    test('Should return one IComment', async () => {
        const { db, dummyUser1 } = await setup();
        const comment = new Comment(user);
        const comments = await comment.getCommentsByUserId(dummyUser1.id);
        expect(comments).toMatchObject([
            {
                __v: 0,
                _id: expect.anything(),
                content: 'Dummy comment 1',
                creation_date: expect.anything(),
                owner_id: dummyUser1.id,
                owner_profile: expect.anything(),
                likes: [],
                votes: [],
            }
        ]);
        await mongoose.disconnect();
        await db.stop();
    });

});