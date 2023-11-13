import express from 'express';
import UserService from "../../service/user.service.js";
const router = express.Router();

router.post('/get_user', async (req, res, next) => {
  try {
    const result = await UserService.findUser(req.body);
    res.status(200).send(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
