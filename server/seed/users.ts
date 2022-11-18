import { TEnneagram, TMBTI } from '../data/comment';
import User from '../model/user';

export default async function seed() {
    console.info('Seeding users');

    const profiles = [
        {
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
        }
    ];
    const user = new User();
    const newUser = await user.createUser({
        name: profiles[0].name,
        description: profiles[0].description,
        mbti: profiles[0].mbti as TMBTI,
        enneagram: profiles[0].enneagram as TEnneagram,
        variant: profiles[0].variant,
        socionics: profiles[0].socionics,
        tritype: profiles[0].tritype,
        sloan: profiles[0].sloan,
        psyche: profiles[0].psyche,
        image: profiles[0].image,
    });
    console.info('Seeded users' + JSON.stringify(newUser, null, 4));
}