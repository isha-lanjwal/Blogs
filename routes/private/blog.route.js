import express from 'express';
import BlogService from '../../service/blog.service.js';
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    req.body.user_id = req.user.user_id
    const result = await BlogService.addBlog(req.body);
    if(result.messageCode == 402){
      res.status(402).send(result);
    }else if(result.messageCode == 409){
      res.status(409).send(result);
    }else{
    res.status(200).send(result);
    }
  } catch (error) {
    return next(error);
  }
});

router.post('/delete_blog', async (req, res, next) => {
  try {
    req.body.user_id = req.user.user_id
    const result = await BlogService.deleteBlog(req.body);
    if(result.messageCode == 402){
      res.status(402).send(result);
    }else{
    res.status(200).send(result);
    }
  } catch (error) {
    return next(error);
  }
});

router.post('/edit_blog',async (req,res,next) => {
  try{
    req.body.user_id = req.user.user_id
    const result = await BlogService.editBlog(req.body);
    if(result.messageCode == 402){
      res.status(402).send(result);
    }else{
    res.status(200).send(result);
    }
  }catch(error){
    return next(error);
  }
})
export default router;
