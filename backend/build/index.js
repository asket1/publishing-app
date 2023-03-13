"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const validations_js_1 = require("./validations.js");
const index_js_1 = require("./controllers/index.js");
const index_js_2 = require("./utils/index.js");
mongoose_1.default.set('strictQuery', true);
mongoose_1.default
    .connect('mongodb+srv://kek:qhWZ4so6Ca6tpdmJ@cluster0.ftkilue.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error', err));
const app = (0, express_1.default)();
const storage = multer_1.default.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/uploads', express_1.default.static('uploads'));
app.get('/', (req, res) => {
    res.status(200).send('main page');
});
app.get('/healthz', (req, res) => {
    res.status(200).send('main page');
});
//user
app.post('/auth/login', validations_js_1.loginValidation, index_js_2.handleValidationErrors, index_js_1.userController.login);
app.post('/auth/register', validations_js_1.registerValidation, index_js_2.handleValidationErrors, index_js_1.userController.register);
app.get('/auth/me', index_js_2.checkAuth, index_js_1.userController.getMe);
app.post('/upload', index_js_2.checkAuth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});
//posts
app.get('/posts', index_js_1.postController.getAll);
app.get('/tags', index_js_1.postController.getLastTags);
app.get('/posts/:id', index_js_1.postController.getOne);
app.post('/posts', index_js_2.checkAuth, validations_js_1.postCreateValidation, index_js_2.handleValidationErrors, index_js_1.postController.create);
app.delete('/posts/:id', index_js_2.checkAuth, index_js_1.postController.remove);
app.patch('/posts/:id', index_js_2.checkAuth, validations_js_1.postCreateValidation, index_js_2.handleValidationErrors, index_js_1.postController.update);
app.listen(4444, '0.0.0.0', (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
});
