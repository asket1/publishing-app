import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import { validationResult } from 'express-validator';

import { loginValidation, registerValidation, postCreateValidation } from './validations.js';
import { userController, postController } from './controllers/index.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';

mongoose.set('strictQuery', true);
mongoose
  .connect(
    'mongodb+srv://kek:qhWZ4so6Ca6tpdmJ@cluster0.ftkilue.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req: Request, res: Response) => {
  res.send('main page');
});

//user
app.post('/auth/login', loginValidation, handleValidationErrors, userController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, userController.register);
app.get('/auth/me', checkAuth, userController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//posts
app.get('/posts', postController.getAll);
app.get('/tags', postController.getLastTags);
app.get('/posts/:id', postController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  postController.update,
);

app.listen(process.env.PORT || 4444, (err?: Error) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
