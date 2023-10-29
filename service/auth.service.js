import responseCode from "../constants/responseCode.js";
import { UserModel } from "../schema/index.js";
import bcrypt from "bcrypt";
import serverConfig from "../constants/serverConfig.js";
import jwt from 'jsonwebtoken';

class AuthService {
    static addUser(user_body) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!user_body || !user_body.username || !user_body.first_name || !user_body.last_name || !user_body.email || !user_body.contact_number || !user_body.password) {
                    resolve({
                        message: "Insufficient Parameters",
                        messageCode: 422
                    });
                }
                const oldUser = await UserModel.countDocuments({
                    $or: [{
                        email: user_body.email
                    },
                    {
                        username: user_body.username
                    },
                    {
                        contact_number: user_body.contact_number
                    }
                    ]
                }).exec();
                if (oldUser) {
                    resolve({
                        messageCode: 409,
                        message: 'User Already Exists'
                    });
                } else {
                    let user = new UserModel(user_body);
                    if (user.password) {
                        await user.setPassword();
                    }
                    await user.generateUserId();
                    await user.save();
                    delete user.password;
                    resolve({
                        messageCode: responseCode["200"],
                        message: "User registered successfully."
                    });
                }


            } catch (error) {
                console.log(error)
                reject({
                    messageCode: 500,
                    message: "Server Error.."
                });
            }
        });
    }

    static login(user_body) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!user_body && (!user_body.username || !user_body.email) && !user_body.password) {
                    resolve({
                        message: "Insufficient Parameters",
                        messageCode: 422
                    });
                }
                const user = await UserModel.findOne({
                    $or: [{
                        email: user_body.email
                    },
                    {
                        username: user_body.username
                    },
                    {
                        contact_number: user_body.contact_number
                    }
                    ]
                }, { password: 0 }).exec();
                if (user) {
                    if (bcrypt.compare(user_body.password, user.password)) {
                        let payload = {
                            _id: user.user_id,
                            uername: user.user_name,
                            email: user.email,
                            expires: Date.now() + parseInt(serverConfig.expiresIn)
                        }
                        const token = jwt.sign(JSON.parse(JSON.stringify(payload)), serverConfig.secrettoken);
                        resolve({
                            messageCode: responseCode["200"],
                            content: { user, token }
                        });
                    }
                } else {
                    resolve({
                        messageCode: 404,
                        message: 'Incorrect credentials'
                    });
                }


            } catch (error) {
                console.log(error)
                reject({
                    messageCode: 500,
                    message: "Server Error.."
                });
            }
        });
    }

    static getUserDetails(user) {
        return new Promise(async (resolve, reject) => {
            try {
                let payload = jwt.verify(accessToken, serverConfig.secrettoken);
                if (payload && payload._id && payload.email) {
                    const user = await UserModel.findOne({user_id:payload._id}, { password: 0 }).exec();
                    resolve({
                        messageCode: responseCode["200"],
                        content: user
                    });
                } else {
                    resolve({
                        messageCode: 401,
                        message: 'Not authorized'
                    });
                }


            } catch (error) {
                console.log(error)
                reject({
                    messageCode: 500,
                    message: "Server Error.."
                });
            }
        });
    }
}

export default AuthService