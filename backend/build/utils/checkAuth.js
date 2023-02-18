"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, 'secretkey');
            req.userId = decoded._id;
            next();
        }
        catch (err) {
            return res.status(403).json({
                message: 'No access2',
            });
        }
    }
    else {
        return res.status(403).json({
            message: 'No access',
        });
    }
};
