import express from 'express';
import UserService from "../../service/user.service.js";
const router = express.Router();

router.post('/get_user', async (req, res, next) => {
  try {
    const result = await UserService.findUser(req.body);
    if (result.messageCode == 402) {
      res.status(402).send(result);
    } else if(result.messageCode == 404){
      res.status(404).send(result);
    }else {
      res.status(200).send(result);
    }
  } catch (error) {
    return next(error);
  }
});

export default router;
