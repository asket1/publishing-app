import {body} from 'express-validator';

export const loginValidation = [
    body('email', 'wrong mail').isEmail(),
    body('password', 'wrong password').isLength({min: 5}),
];

export const registerValidation = [
    body('email', 'wrong mail').isEmail(),
    body('password', 'wrong password').isLength({min: 5}),
    body('fullName', 'wrong name').isLength({min: 3}),
    body('avatarUrl').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'wrong title').isLength({min: 3}).isString(),
    body('text', 'wrong text').isLength({min: 5}).isString(),
    body('tags', 'wrong tags').optional().isArray(),
    body('avatarUrl').optional().isString(),
];