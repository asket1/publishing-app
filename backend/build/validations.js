"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCreateValidation = exports.registerValidation = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidation = [
    (0, express_validator_1.body)('email', 'wrong mail').isEmail(),
    (0, express_validator_1.body)('password', 'wrong password').isLength({ min: 5 }),
];
exports.registerValidation = [
    (0, express_validator_1.body)('email', 'wrong mail').isEmail(),
    (0, express_validator_1.body)('password', 'wrong password').isLength({ min: 5 }),
    (0, express_validator_1.body)('fullName', 'wrong name').isLength({ min: 3 }),
    (0, express_validator_1.body)('avatarUrl').optional().isURL(),
];
exports.postCreateValidation = [
    (0, express_validator_1.body)('title', 'wrong title').isLength({ min: 3 }).isString(),
    (0, express_validator_1.body)('text', 'wrong text').isLength({ min: 5 }).isString(),
    (0, express_validator_1.body)('tags', 'wrong tags').optional().isString(),
    (0, express_validator_1.body)('avatarUrl').optional().isString(),
];
