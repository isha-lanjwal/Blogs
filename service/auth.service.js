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
                        messageCode: 402,
                        success: false
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
                        message: 'User Already Exists',
                        success: false
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
                        message: "User registered successfully.",
                        success: true
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
                        messageCode: 402,
                        message: "Insufficient parameters, provide username and password",
                        success: false
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
                                content: { user, token },
                                success: true
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
                    resolve({
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
                        content: user,
                        success: true
                    });
                } else {
                    resolve({
                        messageCode: 200,
                        messgae: "User does not exist",
                        success: false
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