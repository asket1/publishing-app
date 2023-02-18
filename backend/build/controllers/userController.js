"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_js_1 = __importDefault(require("../models/user.js"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const password = req.body.password;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const doc = new user_js_1.default({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        });
        const user = yield doc.save();
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
        }, 'secretkey', {
            expiresIn: '30d',
        });
        const _a = user.toObject(), { passwordHash } = _a, userData = __rest(_a, ["passwordHash"]);
        res.json(Object.assign(Object.assign({}, userData), { token }));
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'registration fail',
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_js_1.default.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        const isValidPass = yield bcrypt_1.default.compare(req.body.password, user.toObject().passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Wrong password or username',
            });
        }
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
        }, 'secretkey', {
            expiresIn: '30d',
        });
        const _b = user.toObject(), { passwordHash } = _b, userData = __rest(_b, ["passwordHash"]);
        res.json(Object.assign(Object.assign({}, userData), { token }));
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'login fail',
        });
    }
});
exports.login = login;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_js_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        const _c = user.toObject(), { passwordHash } = _c, userData = __rest(_c, ["passwordHash"]);
        res.json(userData);
    }
    catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'Access denied',
        });
    }
});
exports.getMe = getMe;
