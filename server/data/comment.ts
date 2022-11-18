import { model, Schema } from 'mongoose';
import { Dayjs } from 'dayjs';
import { object, string } from 'zod';

export enum TMBTI {
    'INFP' = 'INFP',
    'INFJ' = 'INFJ',
    'ENFP' = 'ENFP',
    'ENFJ' = 'ENFJ',
    'INTJ' = 'INTJ',
    'INTP' = 'INTP',
    'ENTP' = 'ENTP',
    'ENTJ' = 'ENTJ',
    'ISFP' = 'ISFP',
    'ISFJ' = 'ISFJ',
    'ESFP' = 'ESFP',
    'ESFJ' = 'ESFJ',
    'ISTP' = 'ISTP',
    'ISTJ' = 'ISTJ',
    'ESTP' = 'ESTP',
    'ESTJ' = 'ESTJ',
}

export enum TEnneagram {
    '1w2' = '1w2',
    '2w3' = '2w3',
    '3w2' = '3w2',
    '3w4' = '3w4',
    '4w3' = '4w3',
    '4w5' = '4w5',
    '5w4' = '5w4',
    '5w6' = '5w6',
    '6w5' = '6w5',
    '6w7' = '6w7',
    '7w6' = '7w6',
    '7w8' = '7w8',
    '8w7' = '8w7',
    '8w9' = '8w9',
    '9w8' = '9w8',
    '9w1' = '9w1',
    '9w3' = '9w3',
}

export enum TZodiac {
    'Aries' = 'Aries',
    'Taurus' = 'Taurus',
    'Gemini' = 'Gemini',
    'Cancer' = 'Cancer',
    'Leo' = 'Leo',
    'Virgo' = 'Virgo',
    'Libra' = 'Libra',
    'Scorpio' = 'Scorpio',
    'Sagittarius' = 'Sagittarius',
    'Capricorn' = 'Capricorn',
    'Aquarius' = 'Aquarius',
    'Pisces' = 'Pisces',
}

const zCommentContentSchema = object({
    content: string()
        .min(1, 'Comment must be at least one character long.')
        .max(1000, 'Comment must not be longer than 1000 characters.'),
});

interface IComment {
    creation_date: Dayjs;
    content: string;
    votes?: {
        mbti: TMBTI;
        enneagram: TEnneagram;
        zodiac: TZodiac;
    }[];
}

const commentSchema = new Schema<IComment>({
    creation_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
});

export const ModelComment = model('Comment', commentSchema);