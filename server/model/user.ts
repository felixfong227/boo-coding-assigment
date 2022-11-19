import dayjs from 'dayjs';
import z from 'zod';
import { TMBTI, TEnneagram } from '../data/comment';
import { DataUser, IUser } from '../data/user';

const userSchema = z.object({
    name: z.string(),
    description: z.string(),
    mbti: z.nativeEnum(TMBTI),
    enneagram: z.nativeEnum(TEnneagram).optional(),
    variant: z.string().optional(),
    tritype: z.number().optional(),
    socionics: z.string().optional(),
    sloan: z.string().optional(),
    psyche: z.string().optional(),
    image: z.string(),
});
type CreateUserOptions = z.infer<typeof userSchema>;

export default class User {
    private async idLookUp(): Promise<number> {
        const id = await DataUser.countDocuments();
        if(id === 0) return 1;
        return id + 1;
    }
    public async checkUserExists(id: number): Promise<boolean> {
        const user = await this.getUserById(id);
        return Boolean(user);
    }
    public async createUser(opt: CreateUserOptions): Promise<IUser | z.ZodError> {
        const safeOpt = userSchema.safeParse(opt);
        if(!safeOpt.success) {
            return safeOpt.error;
        }
        const { name, description, mbti, enneagram, variant, tritype, socionics, sloan, psyche, image } = safeOpt.data;
        const user = new DataUser({
            id: await this.idLookUp(),
            creation_date: dayjs().unix(),
            name,
            description,
            mbti,
            enneagram,
            variant,
            tritype,
            socionics,
            sloan,
            psyche,
            image,
        });
        const newUser = await user.save();
        return newUser;
    }
    public async getUserById(id: number): Promise<IUser | null> {
        return await DataUser.findOne({
            id,
        });
    }
}