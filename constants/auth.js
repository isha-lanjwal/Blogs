import jwt from 'jsonwebtoken';
import { UserModel } from "../schema/index.js";
import serverConfig from "./serverConfig.js";

const auth = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
            const verifyUser = jwt.verify(token, serverConfig.secrettoken);
            if(Date.now() >= verifyUser.expires * 1000){
                res.status(401).send({
                    messageCode: 401,
                    message: 'Token Expired'
                });
            }else{
                if (verifyUser && verifyUser._id && verifyUser.email) {
                    const user = await UserModel.findOne({ user_id: verifyUser._id })
                    req.token = token;
                    req.user = user;
                    next();
                } else {
                    res.status(401).send({
                        messageCode: 401,
                        message: 'Not authorized'
                    });
                }
            }
         
        } else {
            res.status(401).send({
                messageCode: 401,
                message: 'Not authorized'
            });
        }
    } catch (error) {
        res.status(401).send({
            messageCode: 401,
            message: 'Not authorized'
        });
    }

}
export default auth