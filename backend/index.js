import express from "express";
import mongoose from "mongoose";
import {validationResult} from 'express-validator';

import {loginValidation, registerValidation, postCreateValidation} from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as userController from './controllers/userController.js'
import * as postController from './controllers/postController.js'

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://kek:qhWZ4so6Ca6tpdmJ@cluster0.ftkilue.mongodb.net/blog?retryWrites=true&w=majority")
    .then(()=> console.log('DB OK'))
    .catch((err)=> console.log("DB error", err));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("hello");
});

app.post('/auth/login', userController.login);
app.post('/auth/register', loginValidation, userController.register);
app.get('/auth/me', checkAuth, userController.getMe);
//app.get('/posts', checkAuth, postController.create);

app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.post('/posts', checkAuth, postCreateValidation, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', checkAuth, postController.update);

app.listen(4444, (err) => {
    if(err) {
        return console.log(err)
    }
    console.log("Server OK");
});