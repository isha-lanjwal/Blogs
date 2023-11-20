import express from 'express';
import AuthService from "../../service/auth.service.js";
const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const result = await AuthService.addUser(req.body);
    if (result.messageCode == 402) {
      res.status(402).send(result);
    } else if(result.messageCode == 409){
      res.status(409).send(result);
    }else {
      res.status(200).send(result);
    }
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await AuthService.login(req,res);
    if (result.messageCode == 402) {
      res.status(402).send(result);
    }else {
      res.status(200).send(result);
    }
  } catch (error) {
    return next(error);
  }
});

//forgot password, reset password
export default router;
