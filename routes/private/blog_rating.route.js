import express from 'express';
import BlogRatingService from '../../service/blog_rating.service.js'
const router = express.Router();
router.post('/add_rating', async (req, res, next) => {
    try {
      req.body.user_id = req.user.user_id
      const result = await BlogRatingService.addBlogRating(req.body);
      if(result.messageCode == 402){
        res.status(402).send(result);
      }else{
      res.status(200).send(result);
      }
    } catch (error) {
      return next(error);
    }
  });

export default router;
