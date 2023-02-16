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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastTags = exports.update = exports.remove = exports.create = exports.getOne = exports.getAll = void 0;
const post_1 = __importDefault(require("../models/post"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find().populate('user').exec();
        res.json(posts);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get articles',
        });
    }
});
exports.getAll = getAll;
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        post_1.default.findByIdAndUpdate({
            _id: postId,
        }, {
            $inc: { viewCount: 1 },
        }, {
            returnDocument: 'after',
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Failed to return article',
                });
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Article not found',
                });
            }
            res.json(doc);
        }).populate('user');
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get an article',
        });
    }
});
exports.getOne = getOne;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = new post_1.default({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });
        const post = yield doc.save();
        res.json(post);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Post creation fail',
        });
    }
});
exports.create = create;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        post_1.default.findOneAndDelete({
            _id: postId,
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Failed to delete an article',
                });
            }
            if (!doc) {
                console.log(err);
                return res.status(500).json({
                    message: 'Article not found',
                });
            }
            res.json({
                success: true,
            });
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get an article',
        });
    }
});
exports.remove = remove;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        yield post_1.default.updateOne({
            _id: postId,
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags.split(','),
        });
        res.json({
            success: true,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update an article',
        });
    }
});
exports.update = update;
const getLastTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find().limit(5).exec();
        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);
        res.json(tags);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update an article',
        });
    }
});
exports.getLastTags = getLastTags;
