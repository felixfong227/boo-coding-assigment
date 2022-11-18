'use strict';

import express from 'express';
const router = express.Router();

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
        'image': 'https://soulverse.boo.world/images/1.png',
    }
];

router.get('/*', function(req, res) {
    res.render('profile_template', {
        profile: profiles[0],
    });
});

export default router;