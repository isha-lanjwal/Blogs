// return average rating in blog list
import express from 'express';
import BlogService from '../../service/blog.service.js';
const router = express.Router();

router.post('/get_blogs', async (req, res, next) => {
    try {
        const result = await BlogService.getAllBlogs(req.body);
        res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
});
export default router;
