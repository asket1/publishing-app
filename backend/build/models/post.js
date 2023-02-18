"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: String,
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Post', PostSchema);
