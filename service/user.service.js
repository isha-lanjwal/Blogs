import { UserModel } from "../schema/index.js";
class UserService {
    static findUser(user) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!user.user_id) {
                    reject({
                        message: `Insufficient Parameters`,
                        messageCode: 402,
                        success: false
                    });
                }
                let userData = await UserModel.findOne({user_id: user.user_id},{password:0}).exec();
                if (userData) {
                    resolve({
                        messageCode: 200,
                        content: userData,
                        success: true
                    });
                } else {
                    resolve({
                        messageCode: 404,
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

export default UserService