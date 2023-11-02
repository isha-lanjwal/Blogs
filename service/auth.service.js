import responseCode from "../constants/responseCode.js";
import { UserModel } from "../schema/index.js";
import bcrypt from "bcrypt";
import serverConfig from "../constants/serverConfig.js";
import jwt from 'jsonwebtoken';
import passport from 'passport';

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

    static async login(req, res) {
        return new Promise(async (resolve, reject) => {
            try {
                const { username, password } = req.body;
                if (!username || !password) {
                    resolve({
                        messageCode: 400,
                        message: "Insufficient parameters, provide username and password"
                    });
                } else {
                    passport.authenticate('local', { session: false }, async (err, user) => {
                        if (err) {
                            resolve({
                                messageCode: err.messageCode,
                                message: err.message
                            });
                        } else {
                            let payload = {
                                _id: user._id,
                                user_id: user.user_id,
                                username: user.username,
                                email: user.email,
                                expires: Date.now() + parseInt(serverConfig.expiresIn)
                            }
                            const token = jwt.sign(JSON.parse(JSON.stringify(payload)), serverConfig.secrettoken);
                            resolve({
                                messageCode: responseCode["200"],
                                content: { user, token }
                            });
                        }

                    })(req, res);
                }
            } catch (error) {
                console.log(error)
                return next({
                    messageCode: 500,
                    message: "Server Error.."
                });
            }
        });
    }

    static findUser(username) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!username) {
                    reject({
                        message: `Insufficient Parameters`,
                        messageCode: 422
                    });
                }
                // username can be email or username
                let user = await UserModel.findOne({
                    $or: [{
                        username: username
                    }, {
                        email: username
                    }],
                }).exec();
                if (user) {
                    resolve({
                        messageCode: 200,
                        content: user
                    });
                } else {
                    resolve({
                        messageCode: 404,
                        messgae: "User does not exist"
                    })
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