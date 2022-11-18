import { model, Schema } from 'mongoose';
import { TMBTI, TEnneagram } from './comment';

export interface IUser {
    id: number;
    creation_date: number;
    name: string;
    description: string;
    mbti: TMBTI;
    enneagram: TEnneagram;
    variant: string;
    tritype: number;
    socionics: string;
    sloan: string;
    psyche: string;
    image: string;
}

const userSchema = new Schema<IUser>({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    creation_date: {
        type: Number,
        default: Date.now,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    mbti: {
        type: String,
        required: true,
    },
    enneagram: {
        type: String,
        required: false,
    },
    variant: {
        type: String,
        required: false,
    },
    tritype: {
        type: Number,
        required: false,
    },
    socionics: {
        type: String,
        required: false,
    },
    sloan: {
        type: String,
        required: false,
    },
    psyche: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: true,
    },
});

export const DataUser = model('User', userSchema);