import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import userModel from '../models/user.js';

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new userModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        });
    
        const user = await doc.save(doc);
        const token = jwt.sign({
            _id: user._id,
        }, 
        'secretkey',
        {
            expiresIn: '30d',
        }
        );
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "registration fail"
    });
};
};

export const login = async (req, res)=> {
    try {
        const user = await userModel.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        };
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Wrong password or username',
            });
        };
        const token = jwt.sign({
            _id: user._id,
        }, 
        'secretkey',
        {
            expiresIn: '30d',
        }
        );
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "login fail"
        });
    };
};

export const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        const {passwordHash, ...userData} = user._doc;
        res.json(userData);
        
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: "Access denied"
        });
    }
};