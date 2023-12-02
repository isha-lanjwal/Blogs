import express from 'express';
import BlogRatingService from '../../service/blog_rating.service.js'
const router = express.Router();

router.post('/get_ratings', async (req, res, next) => {
    try {
        const result = await BlogRatingService.getAllRatings(req.body);
        res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
});

export default router;
