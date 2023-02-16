import PostModel from '../models/post';
import { Request, Response } from 'express';

interface postRequest extends Request {
  userId?: string;
}

export const getAll = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to get articles',
    });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
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
      },
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to get an article',
    });
  }
};

export const create = async (req: postRequest, res: Response) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Post creation fail',
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err?: Error, doc?: Document) => {
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
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to get an article',
    });
  }
};

export const update = async (req: postRequest, res: Response) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to update an article',
    });
  }
};

export const getLastTags = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to update an article',
    });
  }
};
