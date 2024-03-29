import mongoose from 'mongoose';
import UserModel from './user.schema.js';
import BlogModel from './blog.schema.js';
import mongoConfig  from '../constants/mongoConfig.js';
import BlogRatingModel from './blog_rating.scheme.js';

const connectDb = () => {
  return mongoose.connect(process.env.DB || mongoConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

export {connectDb,UserModel,BlogModel,BlogRatingModel}

