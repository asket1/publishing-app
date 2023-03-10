import { body, ValidationChain } from 'express-validator';

export const loginValidation: ValidationChain[] = [
  body('email', 'wrong mail').isEmail(),
  body('password', 'wrong password').isLength({ min: 5 }),
];

export const registerValidation: ValidationChain[] = [
  body('email', 'wrong mail').isEmail(),
  body('password', 'wrong password').isLength({ min: 5 }),
  body('fullName', 'wrong name').isLength({ min: 3 }),
  body('avatarUrl').optional().isURL(),
];

export const postCreateValidation: ValidationChain[] = [
  body('title', 'wrong title').isLength({ min: 3 }).isString(),
  body('text', 'wrong text').isLength({ min: 5 }).isString(),
  body('tags', 'wrong tags').optional().isString(),
  body('avatarUrl').optional().isString(),
];
